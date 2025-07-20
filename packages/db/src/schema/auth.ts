import { boolean, index, text, timestamp } from "drizzle-orm/pg-core";
import { baseColumns, createTable, onboardingStatusEnum } from "./common";
import { nanoid } from "nanoid";

// Auth tables
export const user = createTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  jobTitle: text("job_title"),
  onboardingStatus: onboardingStatusEnum("onboardingStatus")
    .default("PENDING")
    .notNull(),
  ...baseColumns,
});

export const session = createTable(
  "session",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    ...baseColumns,
  },
  (table) => ({
    userIdIdx: index("session_user_id_idx").on(table.userId),
  })
);

export const account = createTable("account", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  ...baseColumns,
});

export const verification = createTable("verification", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ...baseColumns,
});
