import { companyMember, type Database } from "@uplog/db";
import { and, eq } from "drizzle-orm";

export async function getUserCompanyId(
  db: Database,
  userId: string
): Promise<string | null> {
  const membership = await db.query.companyMember.findFirst({
    where: and(
      eq(companyMember.userId, userId),
      eq(companyMember.status, "JOINED")
    ),
    columns: { companyId: true },
  });

  return membership?.companyId || null;
}
