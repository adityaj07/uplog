import { invite, type Database } from "@uplog/db";
import { eq } from "drizzle-orm";

// Get invite by ID with company details (for revoke validation)
export async function getInviteById(db: Database, inviteId: string) {
  const inviteData = await db.query.invite.findFirst({
    where: eq(invite.id, inviteId),
    with: {
      company: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });

  return inviteData;
}
