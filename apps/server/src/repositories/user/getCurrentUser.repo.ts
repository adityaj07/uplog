import { user, type Database } from "@uplog/db";
import { eq } from "drizzle-orm";

export async function getCurrentUser(db: Database, userId: string) {
  const currUser = await db.query.user.findFirst({
    where: eq(user.id, userId),
    columns: {
      id: true,
      email: true,
      name: true,
    },
  });

  return currUser;
}
