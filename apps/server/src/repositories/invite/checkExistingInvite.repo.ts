import { invite, type Database } from "@uplog/db";
import { and, desc, eq } from "drizzle-orm";

// Check for existing pending invite
export async function checkExistingInvite(
  db: Database,
  email: string | null,
  companyId: string
) {
  const where = email
    ? and(
        eq(invite.email, email),
        eq(invite.companyId, companyId),
        eq(invite.revoked, false)
      )
    : eq(invite.companyId, companyId);

  const result = await db.query.invite.findMany({
    where,
    orderBy: desc(invite.invitedAt),
    limit: 1,
  });

  return result[0];
}
