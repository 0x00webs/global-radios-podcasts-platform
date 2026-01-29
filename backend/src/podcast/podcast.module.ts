import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { Podcast } from './entities/podcast.entity';
import { PodcastEpisode } from './entities/podcast-episode.entity';
import { PodcastService } from './podcast.service';
import { PodcastController } from './podcast.controller';
import { PodcastIndexService } from './podcast-index.service';
import { PodcastSeedService } from './podcast-seed.service';
import { AppleProvider } from './providers/apple.provider';
import { PodcastIndexProvider } from './providers/podcast-index.provider';
import { TaddyProvider } from './providers/taddy.provider';
import { ProviderRegistry } from './provider.registry';
import { RateLimiterService } from './rate-limiter.service';
import { PodcastSearchManager } from './podcast-search.manager';

/**
 * Podcast Module - Phase 2 Feature
 * Handles podcast discovery and episode streaming
 * Includes multi-provider search system with intelligent deduplication
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Podcast, PodcastEpisode]),
    CacheModule.register(),
  ],
  controllers: [PodcastController],
  providers: [
    PodcastService,
    PodcastIndexService,
    PodcastSeedService,
    AppleProvider,
    PodcastIndexProvider,
    TaddyProvider,
    ProviderRegistry,
    RateLimiterService,
    PodcastSearchManager,
  ],
  exports: [PodcastService, PodcastSeedService, PodcastSearchManager],
})
export class PodcastModule {}
