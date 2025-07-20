import { onboardingCompanySchema, onboardingUserSchema } from "@uplog/schemas";
import z from "zod";

export type onboardingCompanyInput = z.infer<typeof onboardingCompanySchema>;
export type onboardingUserInput = z.infer<typeof onboardingUserSchema>;


