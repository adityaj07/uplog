import { defineConfig } from "drizzle-kit";

// Environment-based database URL selection
const NODE_ENV = process.env.NODE_ENV || "development";

function getDatabaseUrl(): string {
  if (NODE_ENV === "production") {
    // Use pooler URL for production for better performance
    const prodUrl = process.env.DATABASE_URL_POOLER || process.env.DATABASE_URL;
    if (!prodUrl) {
      console.error(
        "❌ Production DATABASE_URL not found. Set DATABASE_URL_POOLER or DATABASE_URL."
      );
      process.exit(1);
    }
    console.log("🚀 Using production database URL (pooler)");
    return prodUrl;
  } else {
    // Use local database URL for development
    const devUrl = process.env.DATABASE_URL;
    if (!devUrl) {
      console.error(
        "❌ Development DATABASE_URL not found. Run 'pnpm env:setup' first."
      );
      process.exit(1);
    }
    console.log("🔧 Using local development database URL");
    return devUrl;
  }
}

const DATABASE_URL = getDatabaseUrl();

export default defineConfig({
  schema: "./src/schema",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
  verbose: true,
});
