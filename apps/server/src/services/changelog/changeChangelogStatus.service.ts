import { ApiError } from "@/lib/api-error";
import {
  changeChangelogStatus,
  deleteChangelog,
} from "@/repositories/changelog";
import type { Database } from "@uplog/db";
import type { ChangeChangelogStatusInput } from "@uplog/types/changelog/index";
import { StatusCodes } from "@uplog/types/common/index";

export async function changeChangelogStatusService(
  db: Database,
  userId: string,
  currentUserCompanyId: string,
  changelogId: string,
  statusInput: ChangeChangelogStatusInput
) {
  try {
    const updatedChangelog = await changeChangelogStatus(
      db,
      userId,
      currentUserCompanyId,
      changelogId,
      statusInput
    );

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
