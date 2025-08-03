import type { Transaction } from "@/db";
import { companyMember } from "@uplog/db";
import { and, eq } from "drizzle-orm";

export async function transferOwnershipRepo(
  tx: Transaction,
  companyId: string,
  currentOwnerId: string,
  newOwnerId: string
) {
  // 1. Update old owner → ADMIN
  const oldOwnerUpdate = tx
    .update(companyMember)
    .set({ role: "ADMIN", updatedAt: new Date() })
    .where(
      and(
        eq(companyMember.id, currentOwnerId),
        eq(companyMember.companyId, companyId)
      )
    );

  // 2. Update new member → OWNER
  const newOwnerUpdate = tx
    .update(companyMember)
    .set({ role: "OWNER", updatedAt: new Date() })
    .where(
      and(
        eq(companyMember.id, newOwnerId),
        eq(companyMember.companyId, companyId)
      )
    );

  await Promise.all([oldOwnerUpdate, newOwnerUpdate]);

  return true;
}
