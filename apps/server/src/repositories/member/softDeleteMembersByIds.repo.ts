import type { Transaction } from "@/db";
import { companyMember, type Database } from "@uplog/db";
import { and, eq, inArray } from "drizzle-orm";

export async function softDeleteMembersByIds(
  db: Database | Transaction,
  companyId: string,
  memberIds: string[]
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
        inArray(companyMember.id, memberIds)
      )
    )
    .returning();

  return result;
}
