import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import multer from "multer";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { UserId } from "../auth/user-id.decorator.js";
import { UploadsService } from "./uploads.service.js";
import { UploadSizeFilter } from "./upload-size.filter.js";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// FileInterceptor runs multer before the handler and puts the file on the request (read with @UploadedFile()).
// Same settings as the Express version: keep the file in memory (it goes straight to Cloudinary), max 5 MB,
// and silently skip other file types, which then hit the "Attach a JPEG..." 400 below.
const imageUpload = FileInterceptor("image", {
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    cb(null, ALLOWED_TYPES.includes(file.mimetype));
  },
});

@Controller("api/uploads")
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private readonly uploads: UploadsService) {}

  // POST /api/uploads/image  (multipart/form-data, field name: "image")
  // Order: JwtAuthGuard → FileInterceptor (multer) → handler, like requireAuth → upload.single("image")
  @Post("image")
  @UseInterceptors(imageUpload)
  @UseFilters(UploadSizeFilter)
  async uploadImage(@UserId() userId: number, @UploadedFile() file: Express.Multer.File | undefined) {
    if (!file) {
      throw new BadRequestException("Attach a JPEG, PNG or WEBP image in the 'image' field");
    }

    return { imageUrl: await this.uploads.uploadImage(file.buffer, userId) };
  }
}
