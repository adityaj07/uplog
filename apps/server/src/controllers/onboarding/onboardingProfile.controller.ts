import type { HonoContext } from "@/ctx";
import { getDatabase } from "@/db";
import { ApiError } from "@/lib/api-error";
import { updateUserProfileService } from "@/services/onboarding";
import type { onboardingUserInput } from "@uplog/types";
import { StatusCodes } from "@uplog/types/common/index";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export async function onboardingProfile(c: Context<HonoContext>) {
  try {
    const sessionUser = c.var.sessionUser!;
    const profileData = await c.req.json<onboardingUserInput>();

    const db = getDatabase();
    const updatedUser = await updateUserProfileService(
      db,
      sessionUser.id,
      profileData
    );

    return c.json({
      success: true,
      data: {
        user: updatedUser,
        message: "Profile updated successfully",
      },
      status: StatusCodes.OK,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return c.json(
        {
          error: error.message,
          code: error.code,
          label: error.label,
          details: error.details ?? null,
        },
        error.status as ContentfulStatusCode
      );
    }

    // Handle unexpected errors
    console.error("Unexpected error in onboardingProfile:", error);
    return c.json(
      {
        error: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
        label: "INTERNAL_SERVER_ERROR",
        details: null,
      },
      StatusCodes.INTERNAL_SERVER_ERROR.code
    );
  }
}
