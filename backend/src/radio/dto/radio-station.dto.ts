/**
 * DTO for radio station responses
 * This is what clients receive - contains only metadata, no audio data
 */
export class RadioStationDto {
  id: string;
  name: string;
  url?: string;
  streamUrl: string; // Client will use this to connect directly
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
}

/**
 * Paginated response wrapper
 */
export class PaginatedResponseDto<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Country/Language summary for filters
 */
export class CountryDto {
  name: string;
  code: string;
  stationCount: number;
}

export class TagDto {
  name: string;
  stationCount: number;
}
