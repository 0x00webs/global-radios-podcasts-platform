import { registerAs } from '@nestjs/config';

const isDev = process.env.NODE_ENV !== 'production';

export default registerAs('database', () => {
  // Prefer DATABASE_URL if present (for Neon/Vercel), else use individual fields
  const databaseUrl = process.env.DATABASE_URL;
  const migrationsPath = __dirname + '/../migrations/*{.ts,.js}';

  if (databaseUrl) {
    return {
      type: 'postgres',
      url: databaseUrl,
      ssl: databaseUrl.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      // DO NOT use schema synchronization in production or dev — use migrations instead
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
      migrations: [migrationsPath],
      // Run migrations automatically on startup in development only
      migrationsRun: isDev,
      migrationsTableName: 'migrations',
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
    // DO NOT use schema synchronization in production or dev — use migrations instead
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    migrations: [migrationsPath],
    migrationsRun: isDev,
    migrationsTableName: 'migrations',
    retryAttempts: 5,
    retryDelay: 3000,
  };
});
