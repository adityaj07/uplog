import { ApiError } from "@/lib/api-error";
import {
  updateUserOnboardingStatus,
  updateUserProfile,
} from "@/repositories/onboarding";
import type { Database } from "@uplog/db";
import type { onboardingUserInput } from "@uplog/types";
import { StatusCodes } from "@uplog/types/common/index";

export async function updateUserProfileService(
  db: Database,
  userId: string,
  profileData: onboardingUserInput
) {
  try {
    // Update user profile
    const updatedUser = await updateUserProfile(db, userId, profileData);

    if (!updatedUser) {
      throw new ApiError("User not found", StatusCodes.NOT_FOUND);
    }

    // Update onboarding status to PROFILE_COMPLETED
    await updateUserOnboardingStatus(db, userId, "PROFILE_COMPLETED");

    return updatedUser;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      "Failed to update user profile",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
