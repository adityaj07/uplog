import { userLoginSchema } from "@uplog/schemas/auth";
import z from "zod";

export type userLoginSchemaT = z.infer<typeof userLoginSchema>;
