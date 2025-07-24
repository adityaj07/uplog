import { ApiError } from "@/lib/api-error";
import { createChangelog, updateChangelog } from "@/repositories/changelog";
import { getUserCompanyMembership } from "@/repositories/invite";
import { getCurrentUser } from "@/repositories/user";
import type { Database } from "@uplog/db";
import type { UpdateChangelogInput } from "@uplog/types/changelog/index";
import { StatusCodes } from "@uplog/types/common/index";

export async function updateChangelogService(
  db: Database,
  userId: string,
  changelogData: UpdateChangelogInput,
  currentUserCompanyId: string,
  changelogId: string
) {
  try {
    // 1. validations
    if (
      changelogData.scheduledAt &&
      new Date(changelogData.scheduledAt) < new Date()
    ) {
      throw new ApiError(
        "Scheduled time cannot be in the past",
        StatusCodes.BAD_REQUEST
      );
    }

    // 2. check for user, company, is user member of company
    const currentUser = await getCurrentUser(db, userId);

    if (!currentUser) {
      throw new ApiError("User not found", StatusCodes.NOT_FOUND);
    }

    const currrentCompany = await getUserCompanyMembership(
      db,
      userId,
      currentUserCompanyId
    );

    if (!currrentCompany) {
      throw new ApiError(
        "Company or user's company membership not found",
        StatusCodes.NOT_FOUND
      );
    }

    // 3. changelog creation
    const updatedChangelog = await updateChangelog(
      db,
      changelogData,
      userId,
      currentUserCompanyId,
      changelogId
    );

    // 5. return result
    return updatedChangelog;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Error creating changelog:", error);
    throw new ApiError(
      "Failed to create changelog",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
