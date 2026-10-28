import { Injectable, type OnModuleDestroy } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";
import { env } from "../config/env.js";

// A provider: Nest creates ONE instance and injects it into every service that asks for it,
// so the whole app shares a single database connection pool.
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    super({ adapter: new PrismaPg({ connectionString: env.DATABASE_URL }) });
  }

  // Lifecycle hook: close the pool when the app shuts down (e.g. Ctrl+C, Render redeploy)
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
