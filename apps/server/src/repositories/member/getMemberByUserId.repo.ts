import type { Transaction } from "@/db";
import { companyMember, type Database } from "@uplog/db";
import { and, eq } from "drizzle-orm";

export async function getMemberByUserId(
  db: Database | Transaction,
  userId: string,
  companyId: string
) {
  const result = await db
    .select({
      id: companyMember.id,
      role: companyMember.role,
      deletedAt: companyMember.deletedAt,
    })
    .from(companyMember)
    .where(
      and(
        eq(companyMember.companyId, companyId),
        eq(companyMember.userId, userId)
      )
    );

  return result[0] || null;
}
