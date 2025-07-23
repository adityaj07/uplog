import { invite, type Database } from "@uplog/db";
import { eq } from "drizzle-orm";

// Mark invite as used
export async function markInviteAsUsed(
  db: Database,
  inviteId: string
): Promise<void> {
  await db
    .update(invite)
    .set({
      usedAt: new Date(),
      useCount: 1, // For single-use invites
      updatedAt: new Date(),
    })
    .where(eq(invite.id, inviteId));
}
