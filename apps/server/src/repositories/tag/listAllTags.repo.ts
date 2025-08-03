import { tag, type Database } from "@uplog/db";
import { and, count, eq, isNull } from "drizzle-orm";

export async function listAllTags(
  db: Database,
  userId: string,
  companyId: string
) {
  const [tags, [{ total }]] = await Promise.all([
    db
      .select()
      .from(tag)
      .where(and(eq(tag.companyId, companyId), isNull(tag.deletedAt)))
      .orderBy(tag.createdAt),

    db
      .select({ total: count() })
      .from(tag)
      .where(and(eq(tag.companyId, companyId), isNull(tag.deletedAt))),
  ]);

  return {
    tags,
    total,
  };
}
