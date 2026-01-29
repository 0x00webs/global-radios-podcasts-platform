import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UsePipes,
  ValidationPipe,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { PodcastIndexService } from './podcast-index.service';
import { PodcastSeedService } from './podcast-seed.service';
import { PodcastSearchManager } from './podcast-search.manager';
import { SearchQueryDto, PaginationDto } from '../common/dto/pagination.dto';
import {
  PodcastDto,
  PaginatedPodcastDto,
  PaginatedEpisodeDto,
} from './dto/podcast.dto';
import { ProviderPodcastResult, ProviderStatus } from './types/podcast-search.types';

/**
 * Podcast Controller
 * Handles all podcast and episode endpoints
 * 
 * Current Implementation:
 * - Podcasts are sourced from multiple providers (Apple iTunes, Podcast Index, Taddy)
 * - Results are deduplicated and intelligently merged
 * - Full episode playback support from RSS feeds
 * - Audio streams connect DIRECTLY to source URLs (no proxying)
 */
@Controller('podcasts')
export class PodcastController {
  private readonly logger = new Logger(PodcastController.name);

  constructor(
    private readonly podcastService: PodcastService,
    private readonly podcastSeedService: PodcastSeedService,
    private readonly searchManager: PodcastSearchManager,
    private readonly podcastIndexService: PodcastIndexService,
  ) {}

  /**
   * GET /api/v1/podcasts/search
   * Search podcasts across multiple providers with intelligent deduplication
   * Query params:
   *   - query: search term (required)
   *   - language: filter by language (optional)
   *   - limit: results per page (default 20, max 50)
   *   - providers: comma-separated list of providers to use (optional, all enabled by default)
   */
  @Get('search')
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchPodcasts(
    @Query() searchDto: SearchQueryDto,
  ): Promise<ProviderPodcastResult[]> {
    this.logger.log(`GET /podcasts/search - query: ${searchDto.query}, providers: ${searchDto.providers?.join(',')}`);
    return this.searchManager.search(searchDto);
  }

  /**
   * GET /api/v1/podcasts/search/status
   * Get usage statistics for all configured providers
   */
  @Get('search/status')
  async getSearchStatus(): Promise<Record<string, any>> {
    this.logger.log('GET /podcasts/search/status');
    return this.searchManager.getUsageStats();
  }

  /**
   * GET /api/v1/podcasts/trending
   * Get trending podcasts globally
   */
  @Get('trending')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getTrendingPodcasts(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedPodcastDto> {
    this.logger.log('GET /podcasts/trending');
    return this.podcastService.getTrendingPodcasts(paginationDto);
  }

  /**
   * GET /api/v1/podcasts/category/:category
   * Get podcasts by category
   */
  @Get('category/:category')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getPodcastsByCategory(
    @Param('category') category: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedPodcastDto> {
    this.logger.log(`GET /podcasts/category/${category}`);
    return this.podcastService.getPodcastsByCategory(category, paginationDto);
  }

  /**
   * GET /api/v1/podcasts/categories
   * Get list of available categories
   */
  @Get('categories')
  async getCategories(): Promise<string[]> {
    this.logger.log('GET /podcasts/categories');
    return this.podcastService.getCategories();
  }

  /**
   * GET /api/v1/podcasts/:podcastId/episodes
   * Get episodes for a specific podcast
   */
  @Get(':podcastId/episodes')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getPodcastEpisodes(
    @Param('podcastId') podcastId: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedEpisodeDto> {
    this.logger.log(`GET /podcasts/${podcastId}/episodes`);
    return this.podcastService.getPodcastEpisodes(podcastId, paginationDto);
  }

  /**
   * GET /api/v1/podcasts/episodes/by-feed?rssUrl=...
   * Fetch and parse podcast episodes directly from an RSS feed without persisting
   */
  @Get('episodes/by-feed')
  async getEpisodesByFeed(
    @Query('rssUrl') rssUrl: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ): Promise<PaginatedEpisodeDto> {
    this.logger.log(`GET /podcasts/episodes/by-feed - rssUrl: ${rssUrl}`);
    if (!rssUrl) {
      throw new BadRequestException('rssUrl query parameter is required');
    }

    const pageNum = Number(page) || 1;
    const limitNum = Math.min(50, Number(limit) || 20);

    const { podcast, episodes } = await this.podcastIndexService.fetchAndParseRssFeed(rssUrl);

    const start = (pageNum - 1) * limitNum;
    const slice = episodes.slice(start, start + limitNum).map((ep) => ({
      id: ep.guid || ep.audioUrl,
      podcastId: rssUrl,
      title: ep.title,
      description: ep.description,
      audioUrl: ep.audioUrl,
      duration: ep.duration,
      imageUrl: ep.imageUrl,
      publishDate: ep.publishDate,
      playCount: 0,
    }));

    const response: PaginatedEpisodeDto = {
      data: slice,
      meta: {
        total: episodes.length,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(episodes.length / limitNum),
      },
    };
    return response;
  }

  /**
   * POST /api/v1/podcasts/add-rss
   * Add a new podcast by RSS URL
   * This allows admins to add custom podcasts and local channels
   */
  @Post('add-rss')
  @UsePipes(new ValidationPipe({ transform: true }))
  async addPodcastByRss(
    @Body() body: { rssUrl: string },
  ): Promise<PodcastDto> {
    this.logger.log(`POST /podcasts/add-rss - ${body.rssUrl}`);
    return this.podcastService.addPodcastByRss(body.rssUrl);
  }

  /**
   * POST /api/v1/podcasts/seed
   * Seed database with popular podcasts
   * This is a utility endpoint for initial setup
   */
  @Post('seed')
  async seedPodcasts(): Promise<{ message: string }> {
    this.logger.log('POST /podcasts/seed - Starting podcast seeding');
    await this.podcastSeedService.seedPodcasts();
    return { message: 'Podcast seeding initiated. Check logs for details.' };
  }
}
