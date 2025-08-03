import {
  bulkRemoveMembers,
  leaveMemberCompany,
  listMembers,
  transferOwnership,
  updateMember,
} from "@/controllers/member";
import { guard } from "@/guards";
import type { EnrichedContext } from "@/guards/types";
import { zValidator } from "@hono/zod-validator";
import {
  BulkRemoveMembersBodySchema,
  BulkRemoveMembersParamSchema,
  LeaveCompanyParamSchema,
  ListMembersParamSchema,
  ListMembersQuerySchema,
  TransferOwnershipParamSchema,
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

// remove member
membersRouter.delete(
  "/",
  guard({
    authRequired: true,
    isOnboarded: true,
    minRole: "ADMIN",
  }),
  zValidator("param", BulkRemoveMembersParamSchema),
  zValidator("json", BulkRemoveMembersBodySchema),
  bulkRemoveMembers
);

// member leaves a company
membersRouter.delete(
  "/leave",
  guard({
    authRequired: true,
    isOnboarded: true,
    minRole: "VIEWER",
  }),
  zValidator("param", LeaveCompanyParamSchema),
  leaveMemberCompany
);

membersRouter.patch(
  "/:memberId/transfer-ownership",
  guard({
    authRequired: true,
    isOnboarded: true,
    minRole: "OWNER",
  }),
  zValidator("param", TransferOwnershipParamSchema),
  transferOwnership
);

export default membersRouter;
