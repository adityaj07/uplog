import { getMe } from "@/controllers/user";
import type { HonoContext } from "@/ctx";
import { authGuard } from "@/guards/authguard";
import { Hono } from "hono";

const usersRouter = new Hono<HonoContext>();

usersRouter.use(authGuard);

usersRouter.get("/me", getMe);

export default usersRouter;
