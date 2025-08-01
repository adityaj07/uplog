import {
  onboardingCompany,
  onboardingComplete,
  onboardingProfile,
} from "@/controllers/onboarding";
import type { HonoContext } from "@/ctx";
import { guard } from "@/guards";
import { zValidator } from "@hono/zod-validator";
import { onboardingCompanySchema, onboardingUserSchema } from "@uplog/schemas";
import { Hono } from "hono";

const onboardingRouter = new Hono<HonoContext>();

onboardingRouter.use(
  guard({
    authRequired: true,
  })
);

onboardingRouter
  .post("/profile", zValidator("json", onboardingUserSchema), onboardingProfile)
  .post(
    "/company",
    zValidator("json", onboardingCompanySchema),
    onboardingCompany
  )
  .post("/complete", onboardingComplete);

export default onboardingRouter;
