import { Catch, HttpException, type ArgumentsHost, type ExceptionFilter } from "@nestjs/common";
import type { Request, Response } from "express";

// Global exception filter: every error thrown anywhere (controllers, services, guards, pipes)
// ends up here, and we turn it into the same JSON bodies the Express version sent.
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      // Express only sets req.route when a route matched, so a 404 without it is an unknown URL
      // (Nest's built-in "Cannot GET /x"). A NotFoundException thrown by a service has req.route.
      if (status === 404 && !req.route) {
        res.status(404).json({ message: "Route not found" });
        return;
      }

      // Validation errors (thrown by ZodValidationPipe) keep their { errors: [...] } shape
      const body = exception.getResponse();
      if (typeof body === "object" && body !== null && "errors" in body) {
        res.status(status).json({ errors: body.errors });
        return;
      }

      res.status(status).json({ message: exception.message });
      return;
    }

    // Anything else is a bug or a crash: log it, but never leak details to the client
    console.error(exception);
    res.status(500).json({ message: "Something went wrong" });
  }
}
