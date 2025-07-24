import { changelog, changelogTag, tag, type Database } from "@uplog/db";
import type { ListChangelogQueryInput } from "@uplog/types/changelog";
import { and, desc, eq, gte, ilike, inArray, lte } from "drizzle-orm";

export async function listChangelogs(
  db: Database,
  userId: string,
  companyId: string,
  query: ListChangelogQueryInput
) {
  const {
    search,
    status,
    tags,
    sort = "createdAt",
    order = "desc",
    isPublic,
    startDate,
    endDate,
    page = 1,
    limit = 10,
  } = query;

  const offset = (page - 1) * limit;
  const whereClauses = [eq(changelog.companyId, companyId)];

  if (status) whereClauses.push(eq(changelog.status, status));
  if (isPublic !== undefined)
    whereClauses.push(eq(changelog.isPublic, isPublic));
  if (search) whereClauses.push(ilike(changelog.title, `%${search}%`));
  if (startDate) whereClauses.push(gte(changelog.createdAt, startDate));
  if (endDate) whereClauses.push(lte(changelog.createdAt, endDate));

  let changelogIdsByTag: string[] | undefined;

  if (tags?.length) {
    // Step 1: Get tag IDs for the current company matching provided tag slugs
    const tagRows = await db
      .select({ id: tag.id })
      .from(tag)
      .where(and(eq(tag.companyId, companyId), inArray(tag.tagSlug, tags)));

    const tagIds = tagRows.map((t) => t.id);
    if (tagIds.length === 0) {
      return { changelogs: [], total: 0, page, limit, hasMore: false };
    }

    // Step 2: Get changelogIds matching any of the tagIds
    const taggedChangelogs = await db
      .select({ changelogId: changelogTag.changelogId })
      .from(changelogTag)
      .where(inArray(changelogTag.tagId, tagIds));

    changelogIdsByTag = [
      ...new Set(taggedChangelogs.map((row) => row.changelogId)),
    ];

    if (changelogIdsByTag.length === 0) {
      return { changelogs: [], total: 0, page, limit, hasMore: false };
    }

    whereClauses.push(inArray(changelog.id, changelogIdsByTag));
  }

  const [changelogs, [{ total }]] = await Promise.all([
    db
      .select()
      .from(changelog)
      .where(and(...whereClauses))
      .orderBy(order === "asc" ? changelog[sort] : desc(changelog[sort]))
      .offset(offset)
      .limit(limit),

    db
      .select({ total: db.$count(changelog) })
      .from(changelog)
      .where(and(...whereClauses)),
  ]);

  const hasMore = offset + changelogs.length < total;

  return {
    changelogs,
    total,
    hasMore,
    page,
    limit,
  };
}
