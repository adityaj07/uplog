import {
  ChangeChangelogStatusSchema,
  CreateChangelogInputSchema,
  ListChangelogQuerySchema,
  PublishToggleSchema,
  UpdateChangelogInputSchema,
} from "@uplog/schemas";
import z from "zod";

export type CreateChangelogInput = z.infer<typeof CreateChangelogInputSchema>;
export type UpdateChangelogInput = z.infer<typeof UpdateChangelogInputSchema>;
export type ChangeChangelogStatusInput = z.infer<
  typeof ChangeChangelogStatusSchema
>;
export type ListChangelogQueryInput = z.infer<typeof ListChangelogQuerySchema>;
export type PublishToggleInput = z.infer<typeof PublishToggleSchema>;
