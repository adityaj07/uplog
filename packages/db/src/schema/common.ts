import { pgEnum, pgTableCreator } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";

// Enums for better type safety
export const roleEnum = pgEnum("role", ["OWNER", "ADMIN", "EDITOR", "VIEWER"]);
export const statusEnum = pgEnum("status", ["PENDING", "JOINED"]);
export const changelogStatusEnum = pgEnum("changelog_status", [
  "DRAFT",
  "PUBLISHED",
  "SCHEDULED",
  "ARCHIVED",
]);
export const onboardingStatusEnum = pgEnum("onboarding_status", [
  "PENDING", // signed up
  "PROFILE_COMPLETED", // profile filled
  "COMPANY_CREATED", // company created
  "COMPLETED", // full onboarding done
]);

export const baseColumns = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
};

export const createTable = pgTableCreator((name) => `uplog_${name}`);
