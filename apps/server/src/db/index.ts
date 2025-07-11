import { env } from "@/lib/env";
import { createDatabase, type Database } from "@uplog/db";

// Create a factory instead of a singleton
function getDatabase(): Database {
  const url =
    env.NODE_ENV === "production"
      ? env.DATABASE_URL_POOLER || env.DATABASE_URL
      : env.DATABASE_URL;

  if (!url) throw new Error("DATABASE_URL not configured");
  return createDatabase(url);
}

export { getDatabase };
