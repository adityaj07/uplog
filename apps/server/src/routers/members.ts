import {
  changeChangelogStatus,
  deleteChangelog,
  getChangelog,
  toggleChangelogPublish,
  updateChangelog,
} from "@/controllers/changelog";
import { listMembers } from "@/controllers/member";
import { guard } from "@/guards";
import type { EnrichedContext } from "@/guards/types";
import { zValidator } from "@hono/zod-validator";
import {
  ChangeChangelogStatusParamSchema,
  ChangeChangelogStatusSchema,
  DeleteChangelogParamSchema,
  GetChangelogByIdSchema,
  ListMembersParamSchema,
  ListMembersQuerySchema,
  PublishToggleSchema,
  UpdateChangelogInputSchema,
  UpdateChangelogParamSchema,
} from "@uplog/schemas";
import { Hono } from "hono";

const membersRouter = new Hono<EnrichedContext>();

// list members
membersRouter.get(
  "/",
  guard({
    authRequired: true,
    isOnboarded: true,
    minRole: "VIEWER",
  }),
  zValidator("param", ListMembersParamSchema),
  zValidator("query", ListMembersQuerySchema),
  listMembers
);

// Get changelog by ID
membersRouter.get(
  "/:id",
  guard({
    authRequired: true,
    isOnboarded: true,
    minRole: "VIEWER",
  }),
  zValidator("param", GetChangelogByIdSchema),
  getChangelog
);

// Update changelog
membersRouter.patch(
  "/:id",
  guard({
    authRequired: true,
    isOnboarded: true,
    minRole: "EDITOR",
  }),
  zValidator("param", UpdateChangelogParamSchema),
  zValidator("json", UpdateChangelogInputSchema),
  updateChangelog
);

// Delete changelog
membersRouter.delete(
  "/:id",
  guard({
    authRequired: true,
    isOnboarded: true,
    minRole: "EDITOR",
  }),
  zValidator("param", DeleteChangelogParamSchema),
  deleteChangelog
);

// Change status (e.g., DRAFT → PUBLISHED)
membersRouter.patch(
  "/:id/status",
  guard({
    authRequired: true,
    isOnboarded: true,
    minRole: "EDITOR",
  }),
  zValidator("param", ChangeChangelogStatusParamSchema),
  zValidator("json", ChangeChangelogStatusSchema),
  changeChangelogStatus
);

// Toggle published state (used by UI toggle switch)
membersRouter.patch(
  "/:id/publish",
  guard({
    authRequired: true,
    isOnboarded: true,
    minRole: "EDITOR",
  }),
  zValidator("param", ChangeChangelogStatusParamSchema),
  zValidator("json", PublishToggleSchema),
  toggleChangelogPublish
);

export default membersRouter;
