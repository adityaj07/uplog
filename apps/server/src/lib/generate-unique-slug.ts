import { changelog, tag, type Database } from "@uplog/db";
import { and, eq } from "drizzle-orm";

type ModelType = "changelog" | "tag";

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function generateUniqueSlug(
  db: Database,
  text: string,
  companyId: string,
  type: ModelType = "changelog"
): Promise<string> {
  const baseSlug = generateSlug(text);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const exists =
      type === "changelog"
        ? await db.query.changelog.findFirst({
            where: and(
              eq(changelog.slug, slug),
              eq(changelog.companyId, companyId)
            ),
          })
        : await db.query.tag.findFirst({
            where: and(eq(tag.tagSlug, slug), eq(tag.companyId, companyId)),
          });

    if (!exists) break;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
