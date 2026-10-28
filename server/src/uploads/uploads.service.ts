import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";

@Injectable()
export class UploadsService {
  // Runs once: Nest creates a single UploadsService for the whole app
  constructor() {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
  }

  // Streams the in-memory file to Cloudinary and resolves with its public HTTPS URL
  uploadImage(buffer: Buffer, userId: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: `styled/users/${userId}`, resource_type: "image" },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Upload failed"));
            return;
          }
          resolve(result.secure_url);
        }
      );
      stream.end(buffer);
    });
  }
}
