import {
  ChangeChangelogStatusParamSchema,
  ChangeChangelogStatusSchema,
  CreateChangelogInputSchema,
  DeleteChangelogParamSchema,
  GetChangelogByIdSchema,
  ListChangelogQuerySchema,
  PublishToggleParamSchema,
  PublishToggleSchema,
  UpdateChangelogInputSchema,
  UpdateChangelogParamSchema,
} from "@uplog/schemas";

import z from "zod";

export type CreateChangelogInput = z.infer<typeof CreateChangelogInputSchema>;
export type UpdateChangelogInput = z.infer<typeof UpdateChangelogInputSchema>;
export type ChangeChangelogStatusInput = z.infer<
  typeof ChangeChangelogStatusSchema
>;
export type ListChangelogQueryInput = z.infer<typeof ListChangelogQuerySchema>;
export type PublishToggleInput = z.infer<typeof PublishToggleSchema>;
export type GetChangelogByIdQueryInput = z.infer<typeof GetChangelogByIdSchema>;
export type UpdateChangelogParamInput = z.infer<
  typeof UpdateChangelogParamSchema
>;
export type DeleteChangelogParamInput = z.infer<
  typeof DeleteChangelogParamSchema
>;
export type ChangeChangelogStatusParamInput = z.infer<
  typeof ChangeChangelogStatusParamSchema
>;
export type PublishToggleParamInput = z.infer<typeof PublishToggleParamSchema>;
