import "dotenv/config";

// Fail fast: the app refuses to start if a required variable is missing.
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is missing from .env`);
  }
  return value;
}

export const env = {
  PORT: Number(process.env.PORT) || 4000,
  DATABASE_URL: required("DATABASE_URL"),
  JWT_SECRET: required("JWT_SECRET"),
  CLOUDINARY_CLOUD_NAME: required("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: required("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: required("CLOUDINARY_API_SECRET"),
  // Optional: the deployed frontend's URL (e.g. https://styled.vercel.app). Unset = allow any origin (local dev).
  // A trailing slash is removed because the browser's Origin header never has one.
  CLIENT_URL: process.env.CLIENT_URL?.replace(/\/+$/, "") || undefined,
};
