import type { HonoContext } from "@/ctx";
import { Hono } from "hono";
import usersRouter from "./users";
import onboardingRouter from "./onboarding";
import companyRouter from "./company";
import inviteRouter from "./invite";
import changelogRouter from "./changelogs";

const indexRouter = new Hono<HonoContext>();

indexRouter.route("/users", usersRouter);
indexRouter.route("/onboarding", onboardingRouter);
indexRouter.route("/company", companyRouter);
indexRouter.route("/invite", inviteRouter);
indexRouter.route("/changelogs", changelogRouter);

export default indexRouter;
