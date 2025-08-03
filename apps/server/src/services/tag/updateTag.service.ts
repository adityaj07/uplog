import { ApiError } from "@/lib/api-error";
import { updateTag } from "@/repositories/tag";
import type { Database } from "@uplog/db";
import type { UpdateTagInput, UpdateTagParamInput } from "@uplog/types";
import { StatusCodes } from "@uplog/types/common/index";

export async function updateTagService(
  db: Database,
  userId: string,
  tagData: UpdateTagInput,
  currentUserCompanyId: string,
  param: UpdateTagParamInput
) {
  try {
    if (param.companyId !== currentUserCompanyId) {
      throw new ApiError("Unauthorized company access", StatusCodes.FORBIDDEN);
    }

    const updatedTag = await updateTag(
      db,
      userId,
      currentUserCompanyId,
      param.tagId,
      tagData
    );

    return updatedTag;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Error updating tag:", error);
    throw new ApiError(
      "Failed to update tag",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
