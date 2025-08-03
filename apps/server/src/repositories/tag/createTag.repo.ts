import { generateUniqueSlug } from "@/lib/generate-unique-slug";
import { tag, type Database } from "@uplog/db";
import type { CreateTagInput } from "@uplog/types";
import { nanoid } from "nanoid";

export async function createTag(
  db: Database,
  userId: string,
  tagData: CreateTagInput,
  currentUserCompanyId: string
) {
  // 1. Generate unique slug
  const tagSlug = await generateUniqueSlug(
    db,
    tagData.tagName,
    currentUserCompanyId,
    "tag"
  );

  // 2. Insert changelog
  const [newTag] = await db
    .insert(tag)
    .values({
      id: nanoid(),
      tagName: tagData.tagName,
      companyId: currentUserCompanyId,
      tagSlug: tagSlug,
      tagEmoji: tagData.tagEmoji,
      tagColor: tagData.tagColor,
      isDefault: tagData.isDefault,
      sortOrder: tagData.sortOrder,
    })
    .returning();

  return newTag;
}
