import {
  ListMembersParamSchema,
  ListMembersQuerySchema,
} from "@uplog/schemas/member/index";
import { z } from "zod";

export type ListMembersQuery = z.infer<typeof ListMembersQuerySchema>;
export type ListMembersParamInput = z.infer<typeof ListMembersParamSchema>;
