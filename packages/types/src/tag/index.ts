import { ListTagsParamSchema } from "@uplog/schemas";
import z from "zod";

export type ListTagsParamInput = z.infer<typeof ListTagsParamSchema>;
