import { relations } from "drizzle-orm";
import { account, session, user } from "./auth";
import { changelog } from "./changelog";
import { company } from "./company";
import { changelogContributor, contributor } from "./contributors";
import { invite } from "./invite";
import { companyMember } from "./members";
import { reaction, reactionConfig } from "./reactions";
import { changelogTag, tag } from "./tags";

// User relations
export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  companyMemberships: many(companyMember),
  changelogsCreated: many(changelog, { relationName: "changelogCreator" }),
  changelogsUpdated: many(changelog, { relationName: "changelogUpdater" }),
  invitesSent: many(invite),
  invitedMembers: many(companyMember, { relationName: "memberInviter" }),
}));

// Session relations
export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

// Account relations
export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

// Company relations
export const companyRelations = relations(company, ({ many }) => ({
  members: many(companyMember),
  changelogs: many(changelog),
  contributors: many(contributor),
  invites: many(invite),
  tags: many(tag),
  reactionConfigs: many(reactionConfig),
}));

// Changelog relations
export const changelogRelations = relations(changelog, ({ one, many }) => ({
  company: one(company, {
    fields: [changelog.companyId],
    references: [company.id],
  }),
  user: one(user, {
    fields: [changelog.userId],
    references: [user.id],
  }),
  createdBy: one(user, {
    fields: [changelog.createdBy],
    references: [user.id],
    relationName: "changelogCreator",
  }),
  updatedBy: one(user, {
    fields: [changelog.updatedBy],
    references: [user.id],
    relationName: "changelogUpdater",
  }),
  changelogContributors: many(changelogContributor),

  changelogTags: many(changelogTag),

  reactions: many(reaction),
}));

// Contributor relations
export const contributorRelations = relations(contributor, ({ one, many }) => ({
  company: one(company, {
    fields: [contributor.companyId],
    references: [company.id],
  }),
  changelogContributors: many(changelogContributor),
}));

// ChangelogContributor relations
export const changelogContributorRelations = relations(
  changelogContributor,
  ({ one }) => ({
    changelog: one(changelog, {
      fields: [changelogContributor.changelogId],
      references: [changelog.id],
    }),
    contributor: one(contributor, {
      fields: [changelogContributor.contributorId],
      references: [contributor.id],
    }),
  })
);

// CompanyMember relations
export const companyMemberRelations = relations(companyMember, ({ one }) => ({
  user: one(user, {
    fields: [companyMember.userId],
    references: [user.id],
  }),
  company: one(company, {
    fields: [companyMember.companyId],
    references: [company.id],
  }),
  invitedByUser: one(user, {
    fields: [companyMember.invitedBy],
    references: [user.id],
    relationName: "memberInviter",
  }),
}));

// Invite relations
export const inviteRelations = relations(invite, ({ one }) => ({
  company: one(company, {
    fields: [invite.companyId],
    references: [company.id],
  }),
  invitedBy: one(user, {
    fields: [invite.invitedBy],
    references: [user.id],
  }),
}));

// Reaction relations
export const reactionRelations = relations(reaction, ({ one }) => ({
  changelog: one(changelog, {
    fields: [reaction.changelogId],
    references: [changelog.id],
  }),
}));

// ReactionConfig relations
export const reactionConfigRelations = relations(reactionConfig, ({ one }) => ({
  company: one(company, {
    fields: [reactionConfig.companyId],
    references: [company.id],
  }),
}));

// Tag relations
export const tagRelations = relations(tag, ({ one, many }) => ({
  company: one(company, {
    fields: [tag.companyId],
    references: [company.id],
  }),
  changelogTags: many(changelogTag),
}));

// ChangelogTag relations
export const changelogTagRelations = relations(changelogTag, ({ one }) => ({
  changelog: one(changelog, {
    fields: [changelogTag.changelogId],
    references: [changelog.id],
  }),
  tag: one(tag, {
    fields: [changelogTag.tagId],
    references: [tag.id],
  }),
}));
