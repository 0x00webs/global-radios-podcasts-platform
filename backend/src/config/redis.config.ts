import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => {
  // In Docker/Codespaces with docker-compose, use container names for host
  // Otherwise use localhost for local development
  const host = process.env.REDIS_HOST || (process.env.DOCKER_ENV === 'true' ? 'redis' : 'localhost');

  return {
    host: host,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    // Allow providing a full Redis URL (useful for hosted Redis with auth)
    url: process.env.REDIS_URL || undefined,
    password: process.env.REDIS_PASSWORD || undefined,
    ttl: parseInt(process.env.REDIS_TTL, 10) || 3600, // Default 1 hour cache
    // Add retry configuration for better reliability
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  };
});
