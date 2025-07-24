import { generateSlug, generateUniqueSlug } from "@/lib/generate-unique-slug";
import { changelog, changelogTag, tag, type Database } from "@uplog/db";
import type { CreateChangelogInput } from "@uplog/types/changelog/index";
import { and, eq, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function createChangelog(
  db: Database,
  changelogData: CreateChangelogInput,
  userId: string,
  currentUserCompanyId: string
) {
  // 1. Generate unique slug
  const changelogSlug = await generateUniqueSlug(
    db,
    changelogData.title,
    currentUserCompanyId,
    "changelog"
  );

  // 2. Insert changelog
  const [newChangelog] = await db
    .insert(changelog)
    .values({
      id: nanoid(),
      title: changelogData.title,
      companyId: currentUserCompanyId,
      content: changelogData.content,
      imageUrl: changelogData.imageUrl,
      slug: changelogSlug,
      userId,
      createdBy: userId,
      status: changelogData.status,
      scheduledAt: changelogData.scheduledAt
        ? new Date(changelogData.scheduledAt)
        : undefined,
      isPublic: changelogData.isPublic,
      publishedAt: changelogData.isPublic ? new Date() : undefined,
    })
    .returning();

  // 2. Batch tag logic
  const tags = changelogData.tags ?? [];

  if (tags.length > 0) {
    const tagSlugs = tags.map((tag) => generateSlug(tag));

    const existingTags = await db
      .select({
        id: tag.id,
        slug: tag.tagSlug,
      })
      .from(tag)
      .where(
        and(
          inArray(tag.tagSlug, tagSlugs),
          eq(tag.companyId, currentUserCompanyId)
        )
      );

    const existingSlugs = new Set(existingTags.map((t) => t.slug));

    const newTags = tags
      .map((tag) => ({
        tagName: tag,
        tagSlug: generateSlug(tag),
        companyId: currentUserCompanyId,
      }))
      .filter((tag) => !existingSlugs.has(tag.tagSlug));

    const insertedTags =
      newTags.length > 0
        ? (await db.insert(tag).values(newTags).returning()).map((row) => ({
            id: row.id,
            tagSlug: row.tagSlug,
          }))
        : [];

    const allTagIds = [...existingTags, ...insertedTags].map((t) => t.id);

    // 3. Insert changelogTag in bulk
    const changelogTagRows = allTagIds.map((tagId) => ({
      tagId,
      changelogId: newChangelog.id,
    }));

    await db.insert(changelogTag).values(changelogTagRows);
  }

  return newChangelog;
}
