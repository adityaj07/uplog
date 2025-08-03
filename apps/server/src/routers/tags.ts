import { listAllTags } from "@/controllers/tag";
import { guard } from "@/guards";
import type { EnrichedContext } from "@/guards/types";
import { zValidator } from "@hono/zod-validator";
import { ListTagsParamSchema } from "@uplog/schemas";
import { Hono } from "hono";

const tagsRouter = new Hono<EnrichedContext>();

// list members
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

export default tagsRouter;
