import type { HonoContext } from "@/ctx";
import { Hono } from "hono";
import changelogRouter from "./changelogs";
import companyRouter from "./company";
import inviteRouter from "./invite";
import membersRouter from "./members";
import onboardingRouter from "./onboarding";
import usersRouter from "./users";

const indexRouter = new Hono<HonoContext>();

indexRouter.route("/users", usersRouter);
indexRouter.route("/onboarding", onboardingRouter);
indexRouter.route("/companies", companyRouter);
indexRouter.route("/invite", inviteRouter);
indexRouter.route("/changelogs", changelogRouter);

export default indexRouter;
