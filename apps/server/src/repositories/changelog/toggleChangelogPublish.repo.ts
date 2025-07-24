import { changelog, type Database } from "@uplog/db";
import type {
  ChangeChangelogStatusInput,
  PublishToggleInput,
} from "@uplog/types/changelog/index";
import { and, eq } from "drizzle-orm";

export async function toggleChangelogPublish(
  db: Database,
  userId: string,
  currentUserCompanyId: string,
  changelogId: string,
  toggleInput: PublishToggleInput
) {
  const updatedChangelogPublishStatus = await db
    .update(changelog)
    .set({ isPublic: toggleInput.isPublished })
    .where(
      and(
        eq(changelog.id, changelogId),
        eq(changelog.companyId, currentUserCompanyId)
      )
    )
    .returning();

  return updatedChangelogPublishStatus;
}
