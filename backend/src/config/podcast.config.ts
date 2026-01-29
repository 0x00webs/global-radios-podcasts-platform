import { registerAs } from '@nestjs/config';

const toBool = (value: string | undefined, defaultValue = true) => {
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
};

const toNumber = (value: string | undefined, defaultValue: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : defaultValue;
};

export default registerAs('podcastProviders', () => ({
  search: {
    defaultLimit: toNumber(process.env.PODCAST_SEARCH_DEFAULT_LIMIT, 20),
    maxLimit: toNumber(process.env.PODCAST_SEARCH_MAX_LIMIT, 50),
    cacheTtlMs: toNumber(process.env.PODCAST_SEARCH_CACHE_TTL_MS, 3600_000),
  },
  providers: {
    apple: {
      enabled: toBool(process.env.PODCAST_APPLE_ENABLED, true),
      priority: toNumber(process.env.PODCAST_APPLE_PRIORITY, 1),
      timeoutMs: toNumber(process.env.PODCAST_APPLE_TIMEOUT_MS, 5000),
      cacheTtlMs: toNumber(process.env.PODCAST_APPLE_CACHE_MS, 3600_000),
      baseUrl: process.env.PODCAST_APPLE_BASE_URL || 'https://itunes.apple.com/search',
      rateLimit: null,
      rateLimitPeriodSeconds: null,
    },
    podcast_index: {
      enabled: toBool(process.env.PODCAST_INDEX_ENABLED, true),
      priority: toNumber(process.env.PODCAST_INDEX_PRIORITY, 2),
      timeoutMs: toNumber(process.env.PODCAST_INDEX_TIMEOUT_MS, 5000),
      cacheTtlMs: toNumber(process.env.PODCAST_INDEX_CACHE_MS, 3600_000),
      baseUrl: process.env.PODCAST_INDEX_BASE_URL || 'https://api.podcastindex.org/api/1.0',
      rateLimit: null,
      rateLimitPeriodSeconds: null,
      apiKey: process.env.PODCAST_INDEX_API_KEY,
      apiSecret: process.env.PODCAST_INDEX_API_SECRET,
    },
    taddy: {
      enabled: toBool(process.env.PODCAST_TADDY_ENABLED, false),
      priority: toNumber(process.env.PODCAST_TADDY_PRIORITY, 3),
      timeoutMs: toNumber(process.env.PODCAST_TADDY_TIMEOUT_MS, 8000),
      cacheTtlMs: toNumber(process.env.PODCAST_TADDY_CACHE_MS, 3600_000),
      baseUrl: process.env.PODCAST_TADDY_BASE_URL || 'https://api.taddy.org',
      apiKey: process.env.TADDY_API_KEY,
      rateLimit: toNumber(process.env.PODCAST_TADDY_RATE_LIMIT, 500),
      rateLimitPeriodSeconds: toNumber(process.env.PODCAST_TADDY_RATE_PERIOD_SECONDS, 30 * 24 * 3600),
    },
  },
}));
