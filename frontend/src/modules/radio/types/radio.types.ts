/**
 * Radio Station types
 * These match the backend DTOs
 */

export interface RadioStation {
  id: string;
  name: string;
  url?: string;
  streamUrl: string; // Client uses this to play audio directly
  country?: string;
  countrycode?: string;
  state?: string;
  language?: string;
  tags?: string[];
  favicon?: string;
  bitrate?: number;
  codec?: string;
  votes?: number;
  ssl?: boolean;
  sourceProviders?: string[]; // Multi-provider support
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Country {
  name: string;
  code: string;
  stationCount: number;
}

export interface Tag {
  name: string;
  stationCount: number;
}

export interface SearchParams {
  query?: string;
  country?: string;
  language?: string;
  tag?: string;
  page?: number;
  limit?: number;
  providers?: string[]; // Multi-provider support
}
