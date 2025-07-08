import { index, text, timestamp, unique } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { baseColumns, createTable, roleEnum, statusEnum } from "./common";
import { company } from "./company";
import { nanoid } from "nanoid";

// Company members
export const companyMember = createTable(
  "company_member",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    companyId: text("company_id")
      .notNull()
      .references(() => company.id, { onDelete: "cascade" }),
    role: roleEnum("role").notNull(),
    status: statusEnum("status").default("PENDING"),
    invitedBy: text("invited_by").references(() => user.id),
    invitedAt: timestamp("invited_at", { withTimezone: true }),
    joinedAt: timestamp("joined_at", { withTimezone: true }),
    ...baseColumns,
  },
  (table) => ({
    userIdIdx: index("company_member_user_id_idx").on(table.userId),
    companyIdIdx: index("company_member_company_id_idx").on(table.companyId),
    // Unique constraint to prevent duplicate memberships
    uniqueMember: unique("unique_company_member").on(
      table.userId,
      table.companyId
    ),
  })
);
