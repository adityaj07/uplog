import {
  acceptInvite,
  createInvite,
  listInvites,
  revokeInvite,
  validateInvite,
} from "@/controllers/invite";
import type { HonoContext } from "@/ctx";
import { guard } from "@/guards";

import { zValidator } from "@hono/zod-validator";
import {
  AcceptInviteSchema,
  CreateInviteInputSchema,
  ListInvitesQuerySchema,
  RevokeInviteSchema,
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

// Create invite - requires auth + onboarding + invite permission
inviteRouter.post(
  "/",
  zValidator("json", CreateInviteInputSchema),
  guard({
    authRequired: true,
    isOnboarded: true,
    canInvite: true,
  }),
  createInvite
);

// List invites - requires auth + onboarding + minimum ADMIN role
inviteRouter.get(
  "/list",
  zValidator("query", ListInvitesQuerySchema),
  guard({
    authRequired: true,
    isOnboarded: true,
    minRole: "ADMIN",
  }),
  listInvites
);

// Accept invite - requires auth only
inviteRouter.post(
  "/accept",
  zValidator("json", AcceptInviteSchema),
  guard({
    authRequired: true,
  }),
  acceptInvite
);

// Revoke invite - requires auth + onboarding + ADMIN role
inviteRouter.post(
  "/revoke",
  zValidator("json", RevokeInviteSchema),
  guard({
    authRequired: true,
    isOnboarded: true,
    minRole: "ADMIN",
  }),
  revokeInvite
);

export default inviteRouter;
