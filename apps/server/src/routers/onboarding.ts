import { onboardingProfile } from "@/controllers/onboarding";
import type { HonoContext } from "@/ctx";
import { authGuard } from "@/guards/authguard";
import { zValidator } from "@hono/zod-validator";
import { onboardingUserSchema } from "@uplog/schemas";
import { Hono } from "hono";

const onboardingRouter = new Hono<HonoContext>();

onboardingRouter.use(authGuard);

onboardingRouter.post(
  "/profile",
  zValidator("json", onboardingUserSchema),
  onboardingProfile
);

export default onboardingRouter;
