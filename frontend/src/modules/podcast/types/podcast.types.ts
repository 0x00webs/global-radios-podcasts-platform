/**
 * Podcast types matching backend DTOs
 * Supports both local database podcasts and multi-provider search results
 */

export interface Podcast {
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

export interface PodcastEpisode {
  id: string;
  podcastId: string;
  title: string;
  description?: string;
  audioUrl: string;
  duration?: number;
  imageUrl?: string;
  publishDate: Date;
  playCount: number;
}

export interface PodcastSearchParams {
  query?: string;
  category?: string;
  language?: string;
  providers?: string[];  // Specific providers: 'apple', 'podcast_index', 'taddy'
  page?: number;
  limit?: number;
}

export interface ProviderStatus {
  name: string;
  used: number;
  limit: number | null;
  remaining: number | null;
  resetInSeconds: number | null;
}
