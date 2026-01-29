import { Injectable, Logger } from '@nestjs/common';

/**
 * Podcast Seed Service (Deprecated)
 * 
 * DEPRECATED: Seeding is no longer needed with multi-provider search.
 * Podcasts are now discovered dynamically from:
 * - Apple iTunes API
 * - Podcast Index API
 * - Taddy API
 * 
 * Use GET /api/v1/podcasts/search instead for podcast discovery.
 */
@Injectable()
export class PodcastSeedService {
  private readonly logger = new Logger(PodcastSeedService.name);

  /**
   * Seed podcasts (deprecated)
   * 
   * This method is kept for backward compatibility but is no longer needed.
   * Multi-provider search provides dynamic podcast discovery.
   */
  async seedPodcasts(): Promise<void> {
    this.logger.warn(
      'Podcast seeding is deprecated. Use multi-provider search instead: GET /api/v1/podcasts/search',
    );
    this.logger.warn(
      'Providers: Apple iTunes (no auth), Podcast Index (free auth), Taddy (optional, rate-limited)',
    );
  }
}
