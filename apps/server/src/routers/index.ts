import type { HonoContext } from "@/ctx";
import { Hono } from "hono";
import usersRouter from "./users";
import onboardingRouter from "./onboarding";

const indexRouter = new Hono<HonoContext>();

indexRouter.route("/users", usersRouter);
indexRouter.route("/onboarding", onboardingRouter);
// indexRouter.route("/changelogs", changelogsRouter);

export default indexRouter;
