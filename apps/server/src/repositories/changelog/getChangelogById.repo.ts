import { changelog, changelogTag, tag, type Database } from "@uplog/db";
import type { ListChangelogQueryInput } from "@uplog/types/changelog";
import { and, desc, eq, gte, ilike, inArray, lte } from "drizzle-orm";

export async function getChangelogById(
  db: Database,
  userId: string,
  companyId: string,
  changelogId: string
) {
  const changelogResult = await db.query.changelog.findFirst({
    where: and(
      eq(changelog.companyId, companyId),
      eq(changelog.id, changelogId)
    ),
  });

  return changelogResult;
}
