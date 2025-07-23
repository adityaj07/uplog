import { companyMember, type Database } from "@uplog/db";
import { and, eq } from "drizzle-orm";

// Get user's company membership with role
export async function getUserCompanyMembership(
  db: Database,
  userId: string,
  companyId: string
) {
  const membership = await db.query.companyMember.findFirst({
    where: and(
      eq(companyMember.userId, userId),
      eq(companyMember.companyId, companyId),
      eq(companyMember.status, "JOINED")
    ),
    with: {
      company: true,
    },
  });
  return membership;
}
