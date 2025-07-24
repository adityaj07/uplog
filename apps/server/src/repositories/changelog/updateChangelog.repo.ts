import { generateSlug, generateUniqueSlug } from "@/lib/generate-unique-slug";
import { changelog, changelogTag, tag, type Database } from "@uplog/db";
import type { UpdateChangelogInput } from "@uplog/types/changelog";
import { and, eq, inArray } from "drizzle-orm";

export async function updateChangelog(
  db: Database,
  changelogData: UpdateChangelogInput,
  userId: string,
  currentUserCompanyId: string,
  changelogId: string
) {
  // Step 1: Prepare updated values
  const updateValues: Record<string, any> = {
    updatedBy: userId,
  };

  if (changelogData.title) {
    const newSlug = await generateUniqueSlug(
      db,
      changelogData.title,
      currentUserCompanyId,
      "changelog"
    );
    updateValues.title = changelogData.title;
    updateValues.slug = newSlug;
  }

  if (changelogData.content !== undefined) {
    updateValues.content = changelogData.content;
  }

  if (changelogData.imageUrl !== undefined) {
    updateValues.imageUrl = changelogData.imageUrl;
  }

  if (changelogData.status !== undefined) {
    updateValues.status = changelogData.status;
  }

  if (changelogData.scheduledAt !== undefined) {
    updateValues.scheduledAt = changelogData.scheduledAt
      ? new Date(changelogData.scheduledAt)
      : null;
  }

  if (changelogData.isPublic !== undefined) {
    updateValues.isPublic = changelogData.isPublic;
    updateValues.publishedAt = changelogData.isPublic ? new Date() : null;
  }

  // Step 2: Update changelog
  const [updatedChangelog] = await db
    .update(changelog)
    .set(updateValues)
    .where(
      and(
        eq(changelog.id, changelogId),
        eq(changelog.companyId, currentUserCompanyId)
      )
    )
    .returning();

  if (!updatedChangelog) return null;

  // Step 3: Handle tag update if provided
  if (changelogData.tags) {
    const tags = changelogData.tags;
    const tagSlugs = tags.map((t) => generateSlug(t));

    const existingTags = await db
      .select({ id: tag.id, slug: tag.tagSlug })
      .from(tag)
      .where(
        and(
          inArray(tag.tagSlug, tagSlugs),
          eq(tag.companyId, currentUserCompanyId)
        )
      );

    const existingSlugs = new Set(existingTags.map((t) => t.slug));

    const newTags = tags
      .map((t) => ({
        tagName: t,
        tagSlug: generateSlug(t),
        companyId: currentUserCompanyId,
      }))
      .filter((t) => !existingSlugs.has(t.tagSlug));

    const insertedTags =
      newTags.length > 0
        ? (await db.insert(tag).values(newTags).returning()).map((t) => ({
            id: t.id,
            tagSlug: t.tagSlug,
          }))
        : [];

    const allTagIds = [...existingTags, ...insertedTags].map((t) => t.id);

    // Delete old tags first
    await db
      .delete(changelogTag)
      .where(eq(changelogTag.changelogId, changelogId));

    // Re-insert new ones
    const tagLinkRows = allTagIds.map((tagId) => ({
      tagId,
      changelogId,
    }));

    await db.insert(changelogTag).values(tagLinkRows);
  }

  return updatedChangelog;
}
