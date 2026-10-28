import { Controller, Get, Res } from "@nestjs/common";
import type { Response } from "express";
import { PrismaService } from "../prisma/prisma.service.js";

// A controller only handles HTTP: the path comes from the decorators, the return value becomes the JSON body
@Controller("api")
export class HealthController {
  // Dependency injection: Nest sees PrismaService in the constructor and passes in the shared instance
  constructor(private readonly prisma: PrismaService) {}

  // GET /api/health
  @Get("health")
  health() {
    return { status: "ok" };
  }

  // GET /api/db-check
  // passthrough: we may set the status code ourselves but still just return the body
  @Get("db-check")
  async dbCheck(@Res({ passthrough: true }) res: Response) {
    try {
      const userCount = await this.prisma.user.count();
      return { database: "connected", users: userCount };
    } catch (error) {
      console.error(error);
      res.status(500);
      return { database: "error" };
    }
  }
}
