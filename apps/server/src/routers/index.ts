import type { HonoContext } from "@/ctx";
import { Hono } from "hono";

const indexRouter = new Hono<HonoContext>();

// indexRouter.route("/users", usersRouter);
// indexRouter.route("/auth", authRouter);
// // ... mount other sub-routers

export { indexRouter };
