import { ApiError } from "@/lib/api-error";
import { getUserCompanyMembership } from "@/repositories/invite";
import { transferOwnershipRepo } from "@/repositories/member";
import type { Database } from "@uplog/db";
import type { TransferOwnershipParamInput } from "@uplog/types";
import { StatusCodes } from "@uplog/types/common/index";

export async function transferOwnershipService(
  db: Database,
  userId: string,
  param: TransferOwnershipParamInput,
  currentUserCompanyId: string
) {
  try {
    if (userId === param.memberId) {
      throw new ApiError("You are already the owner", StatusCodes.BAD_REQUEST);
    }

    const currentMembership = await getUserCompanyMembership(
      db,
      userId,
      currentUserCompanyId
    );

    if (!currentMembership || currentMembership.role !== "OWNER") {
      throw new ApiError(
        "Only owners can transfer ownership",
        StatusCodes.FORBIDDEN
      );
    }

    const targetMembership = await getUserCompanyMembership(
      db,
      param.memberId,
      currentUserCompanyId
    );

    if (!targetMembership) {
      throw new ApiError(
        "Target member not found in the company",
        StatusCodes.NOT_FOUND
      );
    }

    if (targetMembership.role === "OWNER") {
      throw new ApiError(
        "Target member is already an owner",
        StatusCodes.BAD_REQUEST
      );
    }

    const result = await db.transaction(async (tx) => {
      await transferOwnershipRepo(
        tx,
        currentUserCompanyId,
        currentMembership.id,
        targetMembership.id
      );
    });

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Error updating member role:", error);
    throw new ApiError(
      "Failed to update member role",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
