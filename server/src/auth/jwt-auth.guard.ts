import { Injectable, UnauthorizedException, type CanActivate, type ExecutionContext } from "@nestjs/common";
import type { Request } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

// A guard decides if a request may reach the route handler. It runs before pipes and the handler,
// so an invalid token stops the request before any validation or database work (same as requireAuth).
// Usage: @UseGuards(JwtAuthGuard) on a controller (all its routes) or on a single route.
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // 1. Read the "Authorization: Bearer <token>" header
    const req = context.switchToHttp().getRequest<Request>();
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing token");
    }

    const token = header.slice("Bearer ".length);

    // 2. Verify the signature and expiry
    let payload: string | jwt.JwtPayload;
    try {
      payload = jwt.verify(token, env.JWT_SECRET);
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }

    if (typeof payload === "string" || !payload.sub) {
      throw new UnauthorizedException("Invalid token");
    }

    // 3. Attach the user id for @UserId() and let the request through
    req.userId = Number(payload.sub);
    return true;
  }
}
