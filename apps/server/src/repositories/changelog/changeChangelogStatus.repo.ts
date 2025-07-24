import { changelog, type Database } from "@uplog/db";
import type { ChangeChangelogStatusInput } from "@uplog/types/changelog/index";
import { and, eq } from "drizzle-orm";

export async function changeChangelogStatus(
  db: Database,
  userId: string,
  currentUserCompanyId: string,
  changelogId: string,
  statusInput: ChangeChangelogStatusInput
) {
  const updatedChangelogStatus = await db
    .update(changelog)
    .set({ status: statusInput.status })
    .where(
      and(
        eq(changelog.id, changelogId),
        eq(changelog.companyId, currentUserCompanyId)
      )
    )
    .returning();

  return updatedChangelogStatus;
}
