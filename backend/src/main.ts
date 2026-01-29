import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

/**
 * Bootstrap the NestJS application
 * Restart to load updated .env configuration
 */
export async function bootstrap(serverless = false) {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  // Global prefix for all routes
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if extra properties are sent
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Allow CORS for frontend deployment only
  app.enableCors({
    origin: ['https://global-radio-podcast.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  console.log(`✅ CORS configured for origins: [https://global-radio-podcast.vercel.app]`);

  // Start server
  const port = process.env.PORT || 3000;
  if (serverless) {
    // Return a handler for Vercel
    const expressApp = app.getHttpAdapter().getInstance();
    return (req, res) => expressApp(req, res);
  } else {
    await app.listen(port);
    console.log('');
    console.log('🚀 Global Radio & Podcast Platform API');
    console.log(`📡 Server running on: http://localhost:${port}`);
    console.log(`🔗 API endpoint: http://localhost:${port}/${apiPrefix}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('');
  }
}

if (require.main === module) {
  bootstrap();
}

export default bootstrap(true);
