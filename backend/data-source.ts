import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

dotenv.config();

const isDev = process.env.NODE_ENV !== 'production';

const entities = [
	process.cwd() + '/dist/**/*.entity.js',
	process.cwd() + '/src/**/*.entity.ts',
];

const migrations = [
	process.cwd() + '/dist/migrations/*.js',
	process.cwd() + '/src/migrations/*.ts',
];

export default new DataSource({
	type: 'postgres',
	// Prefer DATABASE_URL when present
	url: process.env.DATABASE_URL || undefined,
	host: process.env.DB_HOST || undefined,
	port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
	username: process.env.DB_USERNAME || undefined,
	password: process.env.DB_PASSWORD || undefined,
	database: process.env.DB_DATABASE || undefined,
	ssl:
		process.env.DATABASE_URL && process.env.DATABASE_URL.includes('sslmode=require')
			? { rejectUnauthorized: false }
			: false,
	entities,
	migrations,
	// Never use synchronize in code — use migrations
	synchronize: false,
	// Run migrations automatically in development only
	migrationsRun: isDev,
	migrationsTableName: 'migrations',
});
