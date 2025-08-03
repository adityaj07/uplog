import { ApiError } from "@/lib/api-error";
import { listAllTags } from "@/repositories/tag";
import type { Database } from "@uplog/db";
import type { ListTagsParamInput } from "@uplog/types";
import { StatusCodes } from "@uplog/types/common/index";

export async function listAllTagsService(
  db: Database,
  userId: string,
  currentUserCompanyId: string,
  param: ListTagsParamInput
) {
  try {
    if (param.companyId !== currentUserCompanyId) {
      throw new ApiError("Unauthorized company access", StatusCodes.FORBIDDEN);
    }

    const result = await listAllTags(db, userId, currentUserCompanyId);

    const { tags, total } = result;

    return {
      tags,
      pagination: {
        total,
      },
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Error fetching tags:", error);
    throw new ApiError(
      "Failed to fetch tags",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
