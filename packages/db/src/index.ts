import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzleNode } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

export const createDatabase = (databaseUrl: string) => {
  // Check if it's a local database (localhost) or remote
  const isLocal =
    databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1");

  if (isLocal) {
    // Use node-postgres for local development
    const pool = new pg.Pool({
      connectionString: databaseUrl,
    });
    return drizzleNode(pool, { schema });
  } else {
    // Use Neon serverless for production
    const sql = neon(databaseUrl);
    return drizzleNeon(sql, { schema });
  }
};

export * from "./schema";
export type { Database } from "./types";
