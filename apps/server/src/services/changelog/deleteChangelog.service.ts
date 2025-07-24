import { ApiError } from "@/lib/api-error";
import { deleteChangelog } from "@/repositories/changelog";
import type { Database } from "@uplog/db";
import { StatusCodes } from "@uplog/types/common/index";

export async function deleteChangelogService(
  db: Database,
  userId: string,
  currentUserCompanyId: string,
  changelogId: string
) {
  try {
    const deletedChangelog = await deleteChangelog(
      db,
      userId,
      currentUserCompanyId,
      changelogId
    );

    return deletedChangelog;
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
