import { changelog, type Database } from "@uplog/db";
import { and, eq } from "drizzle-orm";

export async function deleteChangelog(
  db: Database,
  userId: string,
  currentUserCompanyId: string,
  changelogId: string
) {
  const deletedChangelog = await db
    .delete(changelog)
    .where(
      and(
        eq(changelog.id, changelogId),
        eq(changelog.companyId, currentUserCompanyId)
      )
    )
    .returning();

  return deletedChangelog;
}
