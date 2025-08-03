import { createTag, listAllTags, updateTag } from "@/controllers/tag";
import { guard } from "@/guards";
import type { EnrichedContext } from "@/guards/types";
import { zValidator } from "@hono/zod-validator";
import {
  CreateTagParamSchema,
  ListTagsParamSchema,
  UpdateTagParamSchema,
  UpdateTagSchema,
} from "@uplog/schemas";
import { Hono } from "hono";

const tagsRouter = new Hono<EnrichedContext>();

// list tags
tagsRouter.get(
  "/",
  guard({
    authRequired: true,
    isOnboarded: true,
    minRole: "VIEWER",
  }),
  zValidator("param", ListTagsParamSchema),
  listAllTags
);

// create tag
tagsRouter.post(
  "/",
  guard({
    authRequired: true,
    isOnboarded: true,
    minRole: "EDITOR",
  }),
  zValidator("param", CreateTagParamSchema),
  createTag
);

// update tag
tagsRouter.patch(
  "/:tagId",
  guard({
    authRequired: true,
    isOnboarded: true,
    minRole: "EDITOR",
  }),
  zValidator("param", UpdateTagParamSchema),
  zValidator("json", UpdateTagSchema),
  updateTag
);

// delete tag
tagsRouter.patch(
  "/:tagId",
  guard({
    authRequired: true,
    isOnboarded: true,
    minRole: "EDITOR",
  }),
  zValidator("param", ListTagsParamSchema),
  listAllTags
);

export default tagsRouter;
