import type { EnrichedContext } from "@/guards/types";
import { Hono } from "hono";
import membersRouter from "./members";

const companyRouter = new Hono<EnrichedContext>();

companyRouter.route("/:companyId/members", membersRouter);

export default companyRouter;
