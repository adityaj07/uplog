import type { HonoContext } from "@/ctx";
import { Hono } from "hono";
import usersRouter from "./users";

const indexRouter = new Hono<HonoContext>();

indexRouter.route("users", usersRouter);
// indexRouter.route("/changelogs", changelogsRouter);

export default indexRouter;
