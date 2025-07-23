import { invite, type Database } from "@uplog/db";
import { eq } from "drizzle-orm";

// Revoke invite
export async function revokeInvite(
  db: Database,
  inviteId: string,
  revokedBy: string
): Promise<void> {
  await db
    .update(invite)
    .set({
      revoked: true,
      updatedAt: new Date(),
      // Optional: store who revoked it
      // revokedBy: revokedBy,
      // revokedAt: new Date(),
    })
    .where(eq(invite.id, inviteId));
}
