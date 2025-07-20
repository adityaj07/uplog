import { env } from "@/lib/env";
import { createDatabase, type Database } from "@uplog/db";

// Create a singleton database connection
let db: Database | null = null;

function getDatabase(): Database {
  if (!db) {
    const url =
      env.NODE_ENV === "production"
        ? env.DATABASE_URL_POOLER || env.DATABASE_URL
        : env.DATABASE_URL;

    if (!url) throw new Error("DATABASE_URL not configured");
    db = createDatabase(url);
  }
  return db;
}

export { getDatabase };
