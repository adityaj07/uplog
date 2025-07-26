import { companyMember, type Database } from "@uplog/db";
import type { UpdateMemberInput } from "@uplog/types";
import { and, eq } from "drizzle-orm";

export async function updateMember(
  db: Database,
  userId: string,
  memberRoleData: UpdateMemberInput,
  currentUserCompanyId: string
) {
  const result = await db
    .update(companyMember)
    .set({
      role: memberRoleData.role,
    })
    .where(
      and(
        eq(companyMember.userId, userId),
        eq(companyMember.companyId, currentUserCompanyId)
      )
    )
    .returning();

  return result[0];
}
