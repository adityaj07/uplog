import {
  boolean,
  index,
  integer,
  jsonb,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { user } from "./auth";
import { baseColumns, changelogStatusEnum, createTable } from "./common";
import { company } from "./company";

// Changelog table
export const changelog = createTable(
  "changelog",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    title: text("title").notNull(),
    content: jsonb("content").notNull(), // rich content
    imageUrl: text("image_url"),
    status: changelogStatusEnum("status").notNull().default("DRAFT"),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    slug: text("slug").notNull(),
    isPublic: boolean("is_public").default(true),
    viewCount: integer("view_count").default(0),
    // Audit fields
    createdBy: text("created_by").references(() => user.id),
    updatedBy: text("updated_by").references(() => user.id),
    // Relations
    companyId: text("company_id")
      .notNull()
      .references(() => company.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    ...baseColumns,
  },
  (table) => ({
    companyIdIdx: index("changelog_company_id_idx").on(table.companyId),
    slugCompanyIdx: index("changelog_slug_company_idx").on(
      table.slug,
      table.companyId
    ),
    statusIdx: index("changelog_status_idx").on(table.status),
    publishedAtIdx: index("changelog_published_at_idx").on(table.publishedAt),
    // Unique slug per company
    uniqueSlug: unique("unique_changelog_slug").on(table.slug, table.companyId),
  })
);
