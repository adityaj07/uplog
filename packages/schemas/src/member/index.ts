import z from "zod";
import { GetChangelogByIdSchema } from "../changelog";
import { RoleEnum } from "../invite";

export const memberInvitestatusEnum = z.enum(["PENDING", "JOINED"], {
  errorMap: () => ({
    message: "Status must be one of: PENDING, JOINED",
  }),
});

export const memberRoleEnum = z.enum(["OWNER", "ADMIN", "EDITOR", "VIEWER"], {
  errorMap: () => ({
    message: "Status must be one of: OWNER, ADMIN, EDITOR, VIEWER",
  }),
});

export const ListMembersQuerySchema = z.object({
  search: z
    .string({ invalid_type_error: "Search must be a string" })
    .trim()
    .optional(),

  role: RoleEnum.optional(),

  status: memberInvitestatusEnum.optional(),

  sort: z.enum(["createdAt", "updatedAt"]).optional().default("createdAt"),

  order: z.enum(["asc", "desc"]).optional().default("desc"),

  page: z.coerce.number().min(1).optional().default(1),

  limit: z.coerce.number().min(1).max(50).optional().default(10),
});

export const UpdateMemberRoleInputSchema = z.object({
  role: memberRoleEnum,
});

export const ListMembersParamSchema = GetChangelogByIdSchema;
export const UpdateMemberParamSchema = z.object({
  companyId: z
    .string({ required_error: "Company ID is required" })
    .min(1, "Company ID cannot be empty"),
  memberId: z
    .string({ required_error: "Member ID is required" })
    .min(1, "Member ID cannot be empty"),
});

export const BulkRemoveMembersParamSchema = z.object({
  companyId: z.string().min(1),
});

export const BulkRemoveMembersBodySchema = z.object({
  memberIds: z.array(z.string().min(1)).min(1),
});
