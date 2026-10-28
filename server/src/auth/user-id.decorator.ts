import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { Request } from "express";

// Custom parameter decorator: `@UserId() userId: number` hands the handler the id that
// JwtAuthGuard put on the request (replaces `req.userId!` in every Express route).
// Only use it on routes protected by JwtAuthGuard.
export const UserId = createParamDecorator((_data: unknown, context: ExecutionContext): number => {
  const req = context.switchToHttp().getRequest<Request>();
  return req.userId!;
});
