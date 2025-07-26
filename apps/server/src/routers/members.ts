import { listMembers, updateMember } from "@/controllers/member";
import { guard } from "@/guards";
import type { EnrichedContext } from "@/guards/types";
import { zValidator } from "@hono/zod-validator";
import {
  ListMembersParamSchema,
  ListMembersQuerySchema,
  UpdateMemberParamSchema,
  UpdateMemberRoleInputSchema,
} from "@uplog/schemas";
import { Hono } from "hono";

const membersRouter = new Hono<EnrichedContext>();

// list members
membersRouter.get(
  "/",
  guard({
    authRequired: true,
    isOnboarded: true,
    minRole: "VIEWER",
  }),
  zValidator("param", ListMembersParamSchema),
  zValidator("query", ListMembersQuerySchema),
  listMembers
);

// Update member role
membersRouter.patch(
  "/:memberId",
  guard({
    authRequired: true,
    isOnboarded: true,
    minRole: "ADMIN",
  }),
  zValidator("param", UpdateMemberParamSchema),
  zValidator("json", UpdateMemberRoleInputSchema),
  updateMember
);

export default membersRouter;
