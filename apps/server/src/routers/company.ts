import type { HonoContext } from "@/ctx";
import { Hono } from "hono";
import membersRouter from "./members";
import type { EnrichedContext } from "@/guards/types";

const companyRouter = new Hono<EnrichedContext>();

companyRouter.route(
  "/:id/members",

  membersRouter
);

export default companyRouter;
