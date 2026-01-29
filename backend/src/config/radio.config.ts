import { registerAs } from '@nestjs/config';

export default registerAs('radioProviders', () => ({
  providers: {
    radio_browser: {
      enabled: process.env.RADIO_BROWSER_ENABLED !== 'false', // Enabled by default
      priority: parseInt(process.env.RADIO_BROWSER_PRIORITY || '1', 10),
      timeoutMs: parseInt(process.env.RADIO_BROWSER_TIMEOUT_MS || '10000', 10),
      cacheTtlMs: parseInt(process.env.RADIO_BROWSER_CACHE_TTL_MS || '3600000', 10), // 1 hour
      baseUrl: process.env.RADIO_BROWSER_API_URL,
    },
    radionet: {
      enabled: process.env.RADIONET_ENABLED !== 'false', // Enabled by default
      priority: parseInt(process.env.RADIONET_PRIORITY || '2', 10),
      timeoutMs: parseInt(process.env.RADIONET_TIMEOUT_MS || '10000', 10),
      cacheTtlMs: parseInt(process.env.RADIONET_CACHE_TTL_MS || '3600000', 10),
    },
    shoutcast: {
      enabled: process.env.SHOUTCAST_ENABLED !== 'false', // Enabled by default
      priority: parseInt(process.env.SHOUTCAST_PRIORITY || '3', 10),
      timeoutMs: parseInt(process.env.SHOUTCAST_TIMEOUT_MS || '10000', 10),
      cacheTtlMs: parseInt(process.env.SHOUTCAST_CACHE_TTL_MS || '3600000', 10),
    },
  },
  search: {
    cacheTtlMs: parseInt(process.env.RADIO_SEARCH_CACHE_TTL_MS || '3600000', 10), // 1 hour
    defaultLimit: parseInt(process.env.RADIO_SEARCH_DEFAULT_LIMIT || '20', 10),
    maxLimit: parseInt(process.env.RADIO_SEARCH_MAX_LIMIT || '100', 10),
  },
}));
