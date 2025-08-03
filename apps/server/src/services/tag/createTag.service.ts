import { ApiError } from "@/lib/api-error";
import {
  changeChangelogStatus,
  deleteChangelog,
} from "@/repositories/changelog";
import { createTag } from "@/repositories/tag";
import type { Database } from "@uplog/db";
import type { CreateTagInput } from "@uplog/types";
import type { ChangeChangelogStatusInput } from "@uplog/types/changelog/index";
import { StatusCodes } from "@uplog/types/common/index";

export async function createTagService(
  db: Database,
  userId: string,
  tagData: CreateTagInput,
  currentUserCompanyId: string
) {
  try {
    const newTag = await createTag(db, userId, tagData, currentUserCompanyId);

    return newTag;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Error creating tag:", error);
    throw new ApiError(
      "Failed to create tag",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
