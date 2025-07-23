import { companyMember, type Database } from "@uplog/db";
import { and, eq } from "drizzle-orm"; // Check if user already has membership (prevent duplicates)
export async function checkExistingMembership(
  db: Database,
  email: string,
  companyId: string
) {
  const existingMember = await db.query.companyMember.findFirst({
    where: and(eq(companyMember.companyId, companyId)),
    with: {
      user: true,
    },
  });

  return existingMember?.user?.email === email ? existingMember : null;
}
