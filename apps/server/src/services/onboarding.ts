import { ApiError } from "@/lib/api-error";
import { env } from "@/lib/env";
import {
  checkSubdomainExists,
  createCompany,
  createCompanyMember,
  updateUserOnboardingStatus,
  updateUserProfile,
} from "@/repositories/onboarding";
import type { Database } from "@uplog/db";
import type { onboardingCompanyInput, onboardingUserInput } from "@uplog/types";
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

export async function createCompanyService(
  db: Database,
  userId: string,
  companyData: onboardingCompanyInput
) {
  try {
    // subdomain check
    const subdomainExists = await checkSubdomainExists(
      db,
      companyData.subdomain
    );
    if (subdomainExists) {
      throw new ApiError(
        "Subdomain already exists. Please choose a different one.",
        StatusCodes.CONFLICT
      );
    }

    // create the company
    const newCompany = await createCompany(db, companyData);
    if (!newCompany) {
      throw new ApiError(
        "Failed to create company",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    // Add user as company owner
    const membership = await createCompanyMember(
      db,
      userId,
      newCompany.id,
      "OWNER"
    );
    if (!membership) {
      throw new ApiError(
        "Failed to create company membership",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    // Update onboarding status to COMPANY_CREATED
    await updateUserOnboardingStatus(db, userId, "COMPANY_CREATED");

    return {
      company: newCompany,
      membership: membership,
      inviteLink: `${env.BETTER_AUTH_URL}/invite/${newCompany.inviteCode}`,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      "Failed to create company",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
