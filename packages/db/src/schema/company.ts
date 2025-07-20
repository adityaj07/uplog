import { boolean, index, text } from "drizzle-orm/pg-core";
import { baseColumns, createTable, layoutEnum } from "./common";
import { nanoid } from "nanoid";

// Company table
export const company = createTable(
  "company",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: text("name").notNull(),
    subdomain: text("subdomain").notNull().unique(),
    customDomain: text("custom_domain").unique(),
    website: text("website"),
    logo: text("logo"),
    brandColor: text("brand_color"),
    inviteCode: text("invite_code").default(""),
    setupComplete: boolean("setup_complete").default(false),
    // Separate settings into structured fields
    publicReactionsEnabled: boolean("public_reactions_enabled").default(true),
    customCss: text("custom_css"),
    layoutStyle: layoutEnum("changelogpage_layout")
      .default("default")
      .notNull(),
    ...baseColumns,
  },
  (table) => ({
    subdomainIdx: index("company_subdomain_idx").on(table.subdomain),
  })
);
