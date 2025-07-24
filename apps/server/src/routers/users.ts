import { getMe } from "@/controllers/user";
import type { HonoContext } from "@/ctx";
import { guard } from "@/guards";
import { Hono } from "hono";

const usersRouter = new Hono<HonoContext>();

usersRouter.use(
  guard({
    authRequired: true,
    minRole: "ADMIN",
  })
);

usersRouter.get("/me", getMe);

export default usersRouter;
