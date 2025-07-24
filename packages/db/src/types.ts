import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  account,
  changelog,
  changelogContributor,
  changelogTag,
  company,
  companyMember,
  contributor,
  createDatabase,
  invite,
  reaction,
  reactionConfig,
  session,
  tag,
  user,
  verification,
} from "./index";

export type Database = ReturnType<typeof createDatabase>;

// ---------- Select Types ----------
export type Account = InferSelectModel<typeof account>;
export type Session = InferSelectModel<typeof session>;
export type User = InferSelectModel<typeof user>;
export type Verification = InferSelectModel<typeof verification>;

export type Company = InferSelectModel<typeof company>;
export type CompanyMember = InferSelectModel<typeof companyMember>;
export type Invite = InferSelectModel<typeof invite>;

export type Changelog = InferSelectModel<typeof changelog>;
export type Contributor = InferSelectModel<typeof contributor>;
export type ChangelogContributor = InferSelectModel<
  typeof changelogContributor
>;
export type Tag = InferSelectModel<typeof tag>;
export type ChangelogTag = InferSelectModel<typeof changelogTag>;

export type Reaction = InferSelectModel<typeof reaction>;
export type ReactionConfig = InferSelectModel<typeof reactionConfig>;

// ---------- Insert Types ----------
export type InsertAccount = InferInsertModel<typeof account>;
export type InsertSession = InferInsertModel<typeof session>;
export type InsertUser = InferInsertModel<typeof user>;
export type InsertVerification = InferInsertModel<typeof verification>;

export type InsertCompany = InferInsertModel<typeof company>;
export type InsertCompanyMember = InferInsertModel<typeof companyMember>;
export type InsertInvite = InferInsertModel<typeof invite>;

export type InsertChangelog = InferInsertModel<typeof changelog>;
export type InsertContributor = InferInsertModel<typeof contributor>;
export type InsertChangelogContributor = InferInsertModel<
  typeof changelogContributor
>;
export type InsertTag = InferInsertModel<typeof tag>;
export type InsertChangelogTag = InferInsertModel<typeof changelogTag>;

export type InsertReaction = InferInsertModel<typeof reaction>;
export type InsertReactionConfig = InferInsertModel<typeof reactionConfig>;
