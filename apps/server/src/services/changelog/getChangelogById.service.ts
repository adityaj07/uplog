import { ApiError } from "@/lib/api-error";
import { getChangelogById } from "@/repositories/changelog";
import type { Database } from "@uplog/db";
import { StatusCodes } from "@uplog/types/common/index";

export async function getChangelogByIdService(
  db: Database,
  userId: string,
  currentUserCompanyId: string,
  changelogId: string
) {
  try {
    const result = await getChangelogById(
      db,
      userId,
      currentUserCompanyId,
      changelogId
    );

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Error fetching changelogs:", error);
    throw new ApiError(
      "Failed to fetch changelogs",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
