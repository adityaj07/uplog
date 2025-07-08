import { boolean, index, integer, text, unique } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { changelog } from "./changelog";
import { baseColumns, createTable } from "./common";
import { company } from "./company";

// Tags table
export const tag = createTable(
  "tag",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    tagName: text("tag_name").notNull(),
    tagSlug: text("tag_slug").notNull(),
    tagEmoji: text("tag_emoji"),
    tagColor: text("tag_color"),
    isDefault: boolean("is_default").default(false),
    sortOrder: integer("sort_order").default(0),
    companyId: text("company_id")
      .notNull()
      .references(() => company.id, { onDelete: "cascade" }),
    ...baseColumns,
  },
  (table) => ({
    companyIdIdx: index("tag_company_id_idx").on(table.companyId),
    // Unique tag slug per company
    uniqueTagSlug: unique("unique_tag_slug").on(table.tagSlug, table.companyId),
  })
);

// Junction table
export const changelogTag = createTable(
  "changelog_tag",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    changelogId: text("changelog_id")
      .notNull()
      .references(() => changelog.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
    ...baseColumns,
  },
  (table) => ({
    // Unique constraint to prevent duplicate tags on same changelog
    uniqueChangelogTag: unique("unique_changelog_tag").on(
      table.changelogId,
      table.tagId
    ),
  })
);
