import { generateUniqueSlug } from "@/lib/generate-unique-slug";
import { tag, type Database } from "@uplog/db";
import type { UpdateTagInput } from "@uplog/types";
import { and, eq, isNull } from "drizzle-orm";

export async function updateTag(
  db: Database,
  userId: string,
  currentUserCompanyId: string,
  tagId: string,
  tagData: UpdateTagInput
) {
  const updatePayload: Partial<typeof tag.$inferInsert> = {};

  // 1. If tagName is updated, regenerate slug
  if (tagData.tagName) {
    updatePayload.tagName = tagData.tagName;
    updatePayload.tagSlug = await generateUniqueSlug(
      db,
      tagData.tagName,
      currentUserCompanyId,
      "tag"
    );
  }

  // 2. Add remaining optional updates
  if (tagData.tagEmoji !== undefined) updatePayload.tagEmoji = tagData.tagEmoji;
  if (tagData.tagColor !== undefined) updatePayload.tagColor = tagData.tagColor;
  if (typeof tagData.sortOrder === "number")
    updatePayload.sortOrder = tagData.sortOrder;
  if (typeof tagData.isDefault === "boolean")
    updatePayload.isDefault = tagData.isDefault;

  // 3. Skip update if there's nothing to change
  if (Object.keys(updatePayload).length === 0) {
    return null;
  }

  // Optionally update updatedAt
  updatePayload.updatedAt = new Date();

  // 4. Perform update scoped to company + soft-delete check
  const [updated] = await db
    .update(tag)
    .set(updatePayload)
    .where(
      and(
        eq(tag.id, tagId),
        eq(tag.companyId, currentUserCompanyId),
        isNull(tag.deletedAt)
      )
    )
    .returning();

  return updated ?? null;
}
