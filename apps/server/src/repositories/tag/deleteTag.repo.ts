import { tag, type Database } from "@uplog/db";
import { and, eq, isNull } from "drizzle-orm";

export async function deleteTag(
  db: Database,
  userId: string,
  currentUserCompanyId: string,
  tagId: string
) {
  const [deleted] = await db
    .update(tag)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(tag.id, tagId),
        eq(tag.companyId, currentUserCompanyId),
        isNull(tag.deletedAt)
      )
    )
    .returning();

  return deleted ?? null;
}
