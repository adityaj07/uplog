import z from "zod";

export const ListTagsParamSchema = z.object({
  companyId: z.string().min(1),
});
