import { env } from "@/lib/env";
import { createDatabase, type Database } from "@uplog/db";

console.log("Database URL from db:", env.DATABASE_URL ? "Set" : "Missing");

// Environment-based database URL selection
function getDatabaseUrl(): string {
  if (env.NODE_ENV === "production") {
    // Use pooler URL for production
    const prodUrl = env.DATABASE_URL_POOLER || env.DATABASE_URL;
    if (!prodUrl) {
      throw new Error("Production DATABASE_URL not configured");
    }
    return prodUrl;
  } else {
    // Use local database URL for development
    if (!env.DATABASE_URL) {
      throw new Error("Development DATABASE_URL not configured");
    }
    return env.DATABASE_URL;
  }
}

export const db: Database = createDatabase(getDatabaseUrl());
