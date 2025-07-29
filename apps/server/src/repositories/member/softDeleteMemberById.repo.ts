import { companyMember, type Database } from "@uplog/db";
import { and, eq } from "drizzle-orm";

export async function softDeleteMemberById(
  db: Database,
  companyId: string,
  memberId: string
) {
  const result = await db
    .update(companyMember)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(companyMember.companyId, companyId),
        eq(companyMember.userId, memberId)
      )
    )
    .returning();

  return result;
}
