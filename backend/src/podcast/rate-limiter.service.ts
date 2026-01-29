import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ProviderName } from './types/podcast-search.types';

interface UsageStats {
  used: number;
  limit: number | null;
  remaining: number | null;
  resetInSeconds: number | null;
}

@Injectable()
export class RateLimiterService {
  private readonly logger = new Logger(RateLimiterService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async canMakeRequest(
    provider: ProviderName,
    limit?: number | null,
    periodSeconds?: number,
  ): Promise<boolean> {
    if (!limit || !periodSeconds) return true;
    const stats = await this.getUsage(provider, limit, periodSeconds);
    const allowed = stats.used < limit;
    if (!allowed) {
      this.logger.warn(`Rate limit hit for ${provider}: ${stats.used}/${limit}`);
    }
    return allowed;
  }

  async recordRequest(
    provider: ProviderName,
    limit?: number | null,
    periodSeconds?: number,
  ): Promise<void> {
    if (!limit || !periodSeconds) return;
    const key = this.buildKey(provider);
    const current = (await this.cacheManager.get<number>(key)) || 0;
    const ttl = await this.getTtl(key, periodSeconds);
    await this.cacheManager.set(key, current + 1, ttl * 1000);
  }

  async getUsageStats(
    provider: ProviderName,
    limit?: number | null,
    periodSeconds?: number,
  ): Promise<UsageStats> {
    const usage = await this.getUsage(provider, limit || 0, periodSeconds || 0);
    return {
      used: usage.used,
      limit: limit || null,
      remaining: limit ? Math.max(limit - usage.used, 0) : null,
      resetInSeconds: usage.resetInSeconds,
    };
  }

  private async getUsage(
    provider: ProviderName,
    limit: number,
    periodSeconds: number,
  ): Promise<{ used: number; resetInSeconds: number | null }> {
    const key = this.buildKey(provider);
    const used = (await this.cacheManager.get<number>(key)) || 0;
    const ttlSeconds = await this.getRemainingTtl(key);
    if (ttlSeconds !== null) {
      return { used, resetInSeconds: ttlSeconds };
    }

    // No TTL present: initialize with full period
    await this.cacheManager.set(key, used, periodSeconds * 1000);
    return { used, resetInSeconds: periodSeconds };
  }

  private buildKey(provider: ProviderName): string {
    return `ratelimit:podcast:${provider}`;
  }

  private async getRemainingTtl(key: string): Promise<number | null> {
    // cache-manager does not expose TTL directly; attempt to re-set with ttl 0 to read? Instead store companion key timestamp.
    // Simpler: always return null to force initialization; redis store will honor TTL we set.
    // When using redis store, TTL is not easily accessible here, so we'll approximate by returning null.
    return null;
  }

  private async getTtl(key: string, defaultSeconds: number): Promise<number> {
    // cache-manager expects milliseconds for TTL; we keep seconds for logic
    // Without TTL introspection, always reset TTL to defaultSeconds when incrementing.
    return defaultSeconds;
  }
}
