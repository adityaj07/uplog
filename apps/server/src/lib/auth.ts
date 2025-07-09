import { db } from "@/db";
import { env } from "@/lib/env";
import * as schema from "@uplog/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

// Test DB connection
console.log("Database URL:", env.DATABASE_URL ? "Set" : "Missing");
console.log("Google client Id:", env.GOOGLE_CLIENT_ID ? "Set" : "Missing");
console.log(
  "Google client secret:",
  env.GOOGLE_CLIENT_SECRET ? "Set" : "Missing"
);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
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
  trustedOrigins: [env.CORS_ORIGIN, env.BETTER_AUTH_URL],
  socialProviders: {
    google: {
      prompt: "consent",
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
});
