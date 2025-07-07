import { userLoginSchema } from "@convo/schemas/auth";
import z from "zod";

export type userLoginSchemaT = z.infer<typeof userLoginSchema>;
