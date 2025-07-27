import {
  BulkRemoveMembersBodySchema,
  BulkRemoveMembersParamSchema,
  ListMembersParamSchema,
  ListMembersQuerySchema,
  UpdateMemberParamSchema,
  UpdateMemberRoleInputSchema,
} from "@uplog/schemas/member/index";
import { z } from "zod";

export type ListMembersQuery = z.infer<typeof ListMembersQuerySchema>;
export type ListMembersParamInput = z.infer<typeof ListMembersParamSchema>;
export type UpdateMemberInput = z.infer<typeof UpdateMemberRoleInputSchema>;
export type UpdateMemberParamInput = z.infer<typeof UpdateMemberParamSchema>;
export type BulkRemoveMembersParamInput = z.infer<
  typeof BulkRemoveMembersParamSchema
>;
export type BulkRemoveMembersBodyInput = z.infer<
  typeof BulkRemoveMembersBodySchema
>;
