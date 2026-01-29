export type ProviderName = 'apple' | 'podcast_index' | 'taddy' | 'local';

export interface ProviderConfig {
  enabled: boolean;
  priority: number;
  timeoutMs: number;
  cacheTtlMs: number;
  rateLimit?: number | null;
  rateLimitPeriodSeconds?: number;
  apiKey?: string;
  apiSecret?: string;
  baseUrl?: string;
}

export interface ProviderPodcastResult {
  id?: string;
  title: string;
  authorName?: string;
  description?: string;
  imageUrl?: string;
  feedUrl?: string;
  itunesId?: string;
  categories?: string[];
  episodeCount?: number;
  language?: string;
  websiteUrl?: string;
  source: ProviderName;
  sourceProviders?: ProviderName[];
  lastUpdated?: string;
  explicit?: boolean;
  country?: string;
  popularity?: number;
}

export interface ProviderSearchParams {
  query: string;
  limit: number;
  language?: string;
}

export interface ProviderStatus {
  name: ProviderName;
  enabled: boolean;
  available: boolean;
  priority: number;
  rateLimit?: number | null;
  remaining?: number | null;
}
