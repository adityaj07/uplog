import z from "zod";
import { RoleEnum } from "../invite";
import { GetChangelogByIdSchema } from "../changelog";

export const memberInvitestatusEnum = z.enum(["PENDING", "JOINED"], {
  errorMap: () => ({
    message: "Status must be one of: PENDING, JOINED",
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

export const ListMembersParamSchema = GetChangelogByIdSchema;
