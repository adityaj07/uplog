import { createInvite } from "@/controllers/invite";
import type { HonoContext } from "@/ctx";
import { authGuard } from "@/guards/authguard";
import { zValidator } from "@hono/zod-validator";
import { CreateInviteInputSchema } from "@uplog/schemas";
import { Hono } from "hono";

const inviteRouter = new Hono<HonoContext>();

inviteRouter.use(authGuard);

inviteRouter.post(
  "/",
  zValidator("json", CreateInviteInputSchema),
  createInvite
);

export default inviteRouter;
