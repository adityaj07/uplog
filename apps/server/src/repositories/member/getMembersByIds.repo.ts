import type { Transaction } from "@/db";
import { companyMember, type Database } from "@uplog/db";
import { and, eq, inArray, isNull } from "drizzle-orm";

export async function getMembersByIds(
  db: Database | Transaction,
  companyId: string,
  memberIds: string[]
) {
  const result = await db
    .select({
      id: companyMember.id,
      userId: companyMember.userId,
      role: companyMember.role,
      deletedAt: companyMember.deletedAt,
    })
    .from(companyMember)
    .where(
      and(
        eq(companyMember.companyId, companyId),
        inArray(companyMember.id, memberIds),
        isNull(companyMember.deletedAt) // Only get non-deleted members
      )
    );

  return result;
}
