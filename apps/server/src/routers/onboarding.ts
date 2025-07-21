import { onboardingCompany, onboardingProfile } from "@/controllers/onboarding";
import type { HonoContext } from "@/ctx";
import { authGuard } from "@/guards/authguard";
import { zValidator } from "@hono/zod-validator";
import { onboardingCompanySchema, onboardingUserSchema } from "@uplog/schemas";
import { Hono } from "hono";

const onboardingRouter = new Hono<HonoContext>();

onboardingRouter.use(authGuard);

onboardingRouter.post(
  "/profile",
  zValidator("json", onboardingUserSchema),
  onboardingProfile
);

onboardingRouter.post(
  "/company",
  zValidator("json", onboardingCompanySchema),
  onboardingCompany
);

export default onboardingRouter;
