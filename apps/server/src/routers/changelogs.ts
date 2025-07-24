import {
  createChangelog,
  getChangelog,
  updateChangelog,
} from "@/controllers/changelog";
import { listChangelogs } from "@/controllers/changelog/listChangelogs.controller";
import { guard } from "@/guards";
import type { EnrichedContext } from "@/guards/types";
import { zValidator } from "@hono/zod-validator";
import {
  ChangeChangelogStatusSchema,
  CreateChangelogInputSchema,
  GetChangelogByIdSchema,
  ListChangelogQuerySchema,
  PublishToggleSchema,
  UpdateChangelogInputSchema,
} from "@uplog/schemas";
import { Hono } from "hono";

// import {
//   createChangelog,
//   updateChangelog,
//   listChangelogs,
//   getChangelog,
//   deleteChangelog,
//   changeChangelogStatus,
//   toggleChangelogPublish,
// } from "@/controllers/changelog";

const changelogRouter = new Hono<EnrichedContext>();

// Create changelog
changelogRouter.post(
  "/",
  guard({
    authRequired: true,
    isOnboarded: true,
    minRole: "EDITOR",
  }),
  zValidator("json", CreateChangelogInputSchema),
  createChangelog
);

// List changelogs
changelogRouter.get(
  "/",
  guard({
    authRequired: true,
    isOnboarded: true,
    minRole: "VIEWER",
  }),
  zValidator("query", ListChangelogQuerySchema),
  listChangelogs
);

// Get changelog by ID
changelogRouter.get(
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
changelogRouter.patch(
  "/:id",
  guard({
    authRequired: true,
    isOnboarded: true,
    minRole: "EDITOR",
  }),
  zValidator("param", GetChangelogByIdSchema),
  zValidator("json", UpdateChangelogInputSchema),
  updateChangelog
);

// Delete changelog
changelogRouter.delete(
  "/:id"
  // deleteChangelog
);

// Change status (e.g., DRAFT → PUBLISHED)
changelogRouter.patch(
  "/:id/status",
  zValidator("json", ChangeChangelogStatusSchema)
  //   changeChangelogStatus
);

// Toggle published state (used by UI toggle switch)
changelogRouter.patch(
  "/:id/publish",
  zValidator("json", PublishToggleSchema)
  //   toggleChangelogPublish
);

export default changelogRouter;
