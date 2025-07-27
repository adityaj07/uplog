import { env } from "@/lib/env";
import { createDatabase, type Database } from "@uplog/db";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { PgQueryResultHKT, PgTransaction } from "drizzle-orm/pg-core";
import * as schema from "@uplog/db/schema";

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

export type Transaction = PgTransaction<
  PgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

export { getDatabase };
