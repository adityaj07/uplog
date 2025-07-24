import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { HonoContext } from "@/ctx";
import {
  CreateChangelogInputSchema,
  UpdateChangelogInputSchema,
  ListChangelogQuerySchema,
  ChangeChangelogStatusSchema,
  PublishToggleSchema,
} from "@uplog/schemas";

// import {
//   createChangelog,
//   updateChangelog,
//   listChangelogs,
//   getChangelog,
//   deleteChangelog,
//   changeChangelogStatus,
//   toggleChangelogPublish,
// } from "@/controllers/changelog";

const changelogRouter = new Hono<HonoContext>();

// Create changelog
changelogRouter.post(
  "/",
  zValidator("json", CreateChangelogInputSchema)
  //   createChangelog
);

// List changelogs
changelogRouter.get(
  "/",
  zValidator("query", ListChangelogQuerySchema)
  //   listChangelogs
);

// Get changelog by ID
changelogRouter.get(
  "/:id"
  // getChangelog
);

// Update changelog
changelogRouter.put(
  "/:id",
  zValidator("json", UpdateChangelogInputSchema)
  //   updateChangelog
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
