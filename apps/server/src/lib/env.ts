import { env as cloudflareEnv } from "cloudflare:workers";

// For local development, we'll use process.env
// For production (Cloudflare Workers), we'll use cloudflare:workers env
export const env = {
  NODE_ENV: cloudflareEnv?.NODE_ENV || "development",
  DATABASE_URL: cloudflareEnv?.DATABASE_URL || "",
  DATABASE_URL_POOLER: cloudflareEnv?.DATABASE_URL_POOLER || "",
  CORS_ORIGIN: cloudflareEnv?.CORS_ORIGIN || "",
  BETTER_AUTH_SECRET: cloudflareEnv?.BETTER_AUTH_SECRET || "",
  BETTER_AUTH_URL: cloudflareEnv?.BETTER_AUTH_URL || "",
  REDIS_URL: cloudflareEnv?.REDIS_URL || "",
  GOOGLE_CLIENT_ID: cloudflareEnv?.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: cloudflareEnv?.GOOGLE_CLIENT_SECRET || "",
};
