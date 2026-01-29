import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  // Prefer DATABASE_URL if present (for Neon/Vercel), else use individual fields
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    return {
      type: 'postgres',
      url: databaseUrl,
      ssl: databaseUrl.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
      retryAttempts: 5,
      retryDelay: 3000,
    };
  }
  // Fallback to legacy fields
  const host = process.env.DB_HOST || (process.env.DOCKER_ENV === 'true' ? 'postgres' : 'localhost');
  return {
    type: 'postgres',
    host: host,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'radio_platform',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
    retryAttempts: 5,
    retryDelay: 3000,
  };
});
