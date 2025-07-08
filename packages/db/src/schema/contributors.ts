import { index, text, unique } from "drizzle-orm/pg-core";
import { changelog } from "./changelog";
import { baseColumns, createTable } from "./common";
import { company } from "./company";
import { nanoid } from "nanoid";

// Contributors table
export const contributor = createTable(
  "contributor",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: text("name").notNull(),
    email: text("email"),
    avatarUrl: text("avatar_url"),
    companyId: text("company_id")
      .notNull()
      .references(() => company.id, { onDelete: "cascade" }),
    ...baseColumns,
  },
  (table) => ({
    companyIdIdx: index("contributor_company_id_idx").on(table.companyId),
  })
);

// Junction table
export const changelogContributor = createTable(
  "changelog_contributor",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()), // Added primary key
    changelogId: text("changelog_id")
      .notNull()
      .references(() => changelog.id, { onDelete: "cascade" }),
    contributorId: text("contributor_id")
      .notNull()
      .references(() => contributor.id, { onDelete: "cascade" }),
    ...baseColumns,
  },
  (table) => ({
    // Unique constraint to prevent duplicate contributors on same changelog
    uniqueChangelogContributor: unique("unique_changelog_contributor").on(
      table.changelogId,
      table.contributorId
    ),
  })
);
