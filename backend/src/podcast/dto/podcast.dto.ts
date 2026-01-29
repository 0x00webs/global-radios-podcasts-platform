/**
 * Podcast DTOs for API responses
 */

export class PodcastDto {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  authorName?: string;
  language?: string;
  categories: string[];
  country?: string;
  episodeCount: number;
  websiteUrl?: string;
  rssUrl?: string;
  feedUrl?: string;
  source?: string;
  sourceProviders?: string[];
  itunesId?: string;
  explicit?: boolean;
  lastUpdated?: string;
  popularity: number;
  active: boolean;
  updatedAt: Date;
}

export class PodcastEpisodeDto {
  id: string;
  podcastId: string;
  title: string;
  description?: string;
  audioUrl: string;
  duration?: number;
  imageUrl?: string;
  publishDate: Date;
  playCount: number;
  guid?: string;
}

export class PaginatedPodcastDto {
  data: PodcastDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class PaginatedEpisodeDto {
  data: PodcastEpisodeDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
