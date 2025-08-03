import { ApiError } from "@/lib/api-error";
import { deleteTag } from "@/repositories/tag";
import type { Database } from "@uplog/db";
import type { DeleteTagParamInput } from "@uplog/types";
import { StatusCodes } from "@uplog/types/common/index";

export async function deleteTagService(
  db: Database,
  userId: string,
  currentUserCompanyId: string,
  param: DeleteTagParamInput
) {
  try {
    if (param.companyId !== currentUserCompanyId) {
      throw new ApiError("Unauthorized company access", StatusCodes.FORBIDDEN);
    }

    const deletedTag = await deleteTag(
      db,
      userId,
      currentUserCompanyId,
      param.tagId
    );

    return deletedTag;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Error deleting tag:", error);
    throw new ApiError(
      "Failed to delete tag",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
