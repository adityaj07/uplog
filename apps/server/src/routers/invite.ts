import {
  acceptInvite,
  createInvite,
  listInvites,
  validateInvite,
} from "@/controllers/invite";
import type { HonoContext } from "@/ctx";
import { authGuard } from "@/guards/authguard";
import { zValidator } from "@hono/zod-validator";
import {
  AcceptInviteSchema,
  CreateInviteInputSchema,
  ListInvitesQuerySchema,
  ValidateInviteQuerySchema,
} from "@uplog/schemas";
import { Hono } from "hono";

const inviteRouter = new Hono<HonoContext>();

// Public endpoint - NO auth guard
inviteRouter.get(
  "/validate",
  zValidator("query", ValidateInviteQuerySchema),
  validateInvite
);

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

inviteRouter.post(
  "/accept",
  zValidator("json", AcceptInviteSchema),
  acceptInvite
);

export default inviteRouter;
