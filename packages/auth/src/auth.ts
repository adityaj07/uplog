import { createDatabase, type Database } from "@uplog/db";
import * as schema from "@uplog/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";

// Create a factory instead of a singleton
function getDatabase(): Database {
  const url =
    process.env.NODE_ENV === "production"
      ? process.env.DATABASE_URL_POOLER || process.env.DATABASE_URL
      : process.env.DATABASE_URL;

  if (!url) throw new Error("DATABASE_URL not configured");
  return createDatabase(url);
}

const db = getDatabase();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      onboardingStatus: {
        type: "string[]",
        input: true,
        enumValues: [
          "PENDING",
          "PROFILE_COMPLETED",
          "COMPANY_CREATED",
          "COMPLETED",
        ],
      },
    },
  },
  trustedOrigins: [
    process.env.CORS_ORIGIN as string,
    process.env.BETTER_AUTH_URL as string,
  ],
  plugins: [openAPI()],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
});

export type Auth = typeof auth;
