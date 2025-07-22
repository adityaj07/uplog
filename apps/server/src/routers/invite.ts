import { createInvite, listInvites } from "@/controllers/invite";
import type { HonoContext } from "@/ctx";
import { authGuard } from "@/guards/authguard";
import { zValidator } from "@hono/zod-validator";
import {
  CreateInviteInputSchema,
  ListInvitesQuerySchema,
} from "@uplog/schemas";
import { Hono } from "hono";

const inviteRouter = new Hono<HonoContext>();

inviteRouter.use(authGuard);

inviteRouter.post(
  "/",
  zValidator("json", CreateInviteInputSchema),
  createInvite
);

inviteRouter.get(
  "/list",
  zValidator("query", ListInvitesQuerySchema),
  listInvites
);

export default inviteRouter;
