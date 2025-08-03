import type { EnrichedContext } from "@/guards/types";
import { Hono } from "hono";
import changelogRouter from "./changelogs";
import membersRouter from "./members";
import tagsRouter from "./tags";

const companyRouter = new Hono<EnrichedContext>();

companyRouter.route("/:companyId/members", membersRouter);
companyRouter.route("/:companyId/changelogs", changelogRouter);
companyRouter.route("/:companyId/tags", tagsRouter);

export default companyRouter;
