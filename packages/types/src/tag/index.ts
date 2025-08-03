import {
  CreateTagParamSchema,
  CreateTagSchema,
  DeleteTagParamSchema,
  ListTagsParamSchema,
  TagCompanyParamSchema,
  TagIdParamSchema,
  UpdateTagParamSchema,
  UpdateTagSchema,
} from "@uplog/schemas";
import z from "zod";

export type ListTagsParamInput = z.infer<typeof ListTagsParamSchema>;

export type CreateTagInput = z.infer<typeof CreateTagSchema>;
export type CreateTagParamInput = z.infer<typeof CreateTagParamSchema>;

export type UpdateTagInput = z.infer<typeof UpdateTagSchema>;
export type UpdateTagParamInput = z.infer<typeof UpdateTagParamSchema>;

export type TagIdParamInput = z.infer<typeof TagIdParamSchema>;
export type TagCompanyParamInput = z.infer<typeof TagCompanyParamSchema>;

export type DeleteTagParamInput = z.infer<typeof DeleteTagParamSchema>;
