import { boolean, index, integer, text, unique } from "drizzle-orm/pg-core";
import { changelog } from "./changelog";
import { baseColumns, createTable } from "./common";
import { company } from "./company";
import { nanoid } from "nanoid";

// Reaction table
export const reaction = createTable(
  "reaction",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    emoji: text("emoji").notNull(),
    changelogId: text("changelog_id")
      .notNull()
      .references(() => changelog.id, { onDelete: "cascade" }),
    anonymousId: text("anonymous_id").notNull(),
    // Optional: store IP for spam prevention
    ipAddress: text("ip_address"),
    ...baseColumns,
  },
  (table) => ({
    changelogIdIdx: index("reaction_changelog_id_idx").on(table.changelogId),
    // Prevent duplicate reactions from same anonymous user
    uniqueReaction: unique("unique_reaction").on(
      table.changelogId,
      table.emoji,
      table.anonymousId
    ),
  })
);

// Reaction config table
export const reactionConfig = createTable(
  "reaction_config",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    emoji: text("emoji").notNull(),
    label: text("label"),
    companyId: text("company_id")
      .notNull()
      .references(() => company.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").default(0),
    isEnabled: boolean("is_enabled").default(true),
    ...baseColumns,
  },
  (table) => ({
    companyIdIdx: index("reaction_config_company_id_idx").on(table.companyId),
    // Unique emoji per company
    uniqueEmoji: unique("unique_reaction_emoji").on(
      table.companyId,
      table.emoji
    ),
  })
);
