import { env } from "./config/env.js"; // stays first: loads .env and validates it

import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module.js";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter.js";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // In production only the deployed client may call the API; locally (no CLIENT_URL) any origin can.
    cors: env.CLIENT_URL ? { origin: env.CLIENT_URL } : true,
    // Nest parses JSON and urlencoded bodies by default; the Express version only parsed JSON
    bodyParser: false,
  });

  app.useBodyParser("json");
  // No app.setGlobalPrefix("api"): Nest's 404 handler would then only cover /api/*, and other
  // URLs would get Express's HTML page. Controllers include "api/" in their own path instead.
  app.useGlobalFilters(new AllExceptionsFilter());
  // Lets PrismaService.onModuleDestroy run on Ctrl+C / Render shutdown
  app.enableShutdownHooks();

  await app.listen(env.PORT);
  console.log(`API running on http://localhost:${env.PORT}`);
}

void bootstrap();
