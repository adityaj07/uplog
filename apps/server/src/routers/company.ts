import type { HonoContext } from "@/ctx";
import { authGuard } from "@/guards/authguard";
import { Hono } from "hono";

const companyRouter = new Hono<HonoContext>();

companyRouter.use(authGuard);

export default companyRouter;
