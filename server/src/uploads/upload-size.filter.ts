import { Catch, PayloadTooLargeException, type ArgumentsHost, type ExceptionFilter } from "@nestjs/common";
import type { Response } from "express";

// A scoped exception filter, used only on the upload route with @UseFilters (it wins over the global one there).
// FileInterceptor turns multer's "File too large" error into a 413 PayloadTooLargeException;
// the Express version answered 400 with a friendlier message, so we keep doing that.
@Catch(PayloadTooLargeException)
export class UploadSizeFilter implements ExceptionFilter {
  catch(_exception: PayloadTooLargeException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    res.status(400).json({ message: "Image must be 5 MB or smaller" });
  }
}
