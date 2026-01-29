// Vercel serverless entry point for NestJS
import { bootstrap } from './src/main';

export default async function handler(req: any, res: any) {
  // Only bootstrap once (Vercel may reuse the instance)
  if (!globalThis.nestApp) {
    globalThis.nestApp = await bootstrap(true); // pass true for serverless
  }
  return globalThis.nestApp(req, res);
}
