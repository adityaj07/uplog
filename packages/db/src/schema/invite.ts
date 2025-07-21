import {
  boolean,
  index,
  integer,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { user } from "./auth";
import { baseColumns, createTable, inviteTypeEnum, roleEnum } from "./common";
import { company } from "./company";

export const invite = createTable(
  "invite",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    companyId: text("company_id")
      .notNull()
      .references(() => company.id, { onDelete: "cascade" }),
    email: text("email"), // can be null for manual codes
    code: text("code").notNull().unique(), // unique invite code / token
    role: roleEnum("role").notNull(),
    type: inviteTypeEnum("type").notNull(),
    maxUses: integer("max_uses").default(1).notNull(),
    useCount: integer("use_count").default(0).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }).notNull(),
    revoked: boolean("revoked").default(false).notNull(),
    invitedBy: text("invited_by").references(() => user.id),
    invitedAt: timestamp("invited_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    ...baseColumns,
  },

  (table) => ({
    companyIdIdx: index("invite_company_id_idx").on(table.companyId),
    codeUnique: unique("unique_invite_code").on(table.code),
    emailCompanyIdx: index("invite_email_company_idx").on(
      table.email,
      table.companyId
    ),
  })
);
