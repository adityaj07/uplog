import { user, type Database } from "@uplog/db";
import { eq } from "drizzle-orm";

// Get user by email (for email invite validation)
export async function getUserByEmail(db: Database, email: string) {
  return await db.query.user.findFirst({
    where: eq(user.email, email),
    columns: {
      id: true,
      email: true,
      name: true,
    },
  });
}
