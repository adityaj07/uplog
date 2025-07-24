import { ApiError } from "@/lib/api-error";
import { toggleChangelogPublish } from "@/repositories/changelog";
import type { Database } from "@uplog/db";
import type { PublishToggleInput } from "@uplog/types/changelog/index";
import { StatusCodes } from "@uplog/types/common/index";

export async function toggleChangelogPublishService(
  db: Database,
  userId: string,
  currentUserCompanyId: string,
  changelogId: string,
  toggleInput: PublishToggleInput
) {
  try {
    const updatedChangelog = await toggleChangelogPublish(
      db,
      userId,
      currentUserCompanyId,
      changelogId,
      toggleInput
    );

    return updatedChangelog;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Error updating changelog publish status:", error);
    throw new ApiError(
      "Failed to update changelog publish status",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
