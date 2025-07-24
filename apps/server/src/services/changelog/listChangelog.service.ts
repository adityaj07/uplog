import { ApiError } from "@/lib/api-error";
import { listChangelogs } from "@/repositories/changelog/listChangelogs.repo";
import type { Database } from "@uplog/db";
import type { ListChangelogQueryInput } from "@uplog/types/changelog/index";
import { StatusCodes } from "@uplog/types/common/index";

export async function listChangelogService(
  db: Database,
  userId: string,
  currentUserCompanyId: string,
  query: ListChangelogQueryInput
) {
  try {
    const result = await listChangelogs(
      db,
      userId,
      currentUserCompanyId,
      query
    );

    const { changelogs, total, page, limit, hasMore } = result;

    return {
      changelogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore,
      },
    };
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
