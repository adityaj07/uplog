import { ApiError } from "@/lib/api-error";
import {
    updateUserOnboardingStatus
} from "@/repositories/onboarding";
import type { Database } from "@uplog/db";
import { StatusCodes } from "@uplog/types/common/index";

export async function onboardingCompleteService(db: Database, userId: string) {
  try {
    const result = await updateUserOnboardingStatus(db, userId, "COMPLETED");

    return {
      result,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      "Failed to complete onboarding",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
