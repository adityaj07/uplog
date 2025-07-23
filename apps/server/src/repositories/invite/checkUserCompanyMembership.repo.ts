import { companyMember, type Database } from "@uplog/db";
import { and, eq } from "drizzle-orm";

// Check if user is already a member of the company (for validation)
export async function checkUserCompanyMembership(
  db: Database,
  userId: string,
  companyId: string
) {
  const membership = await db.query.companyMember.findFirst({
    where: and(
      eq(companyMember.userId, userId),
      eq(companyMember.companyId, companyId)
    ),
    columns: {
      id: true,
      role: true,
      status: true,
    },
  });

  return membership;
}
