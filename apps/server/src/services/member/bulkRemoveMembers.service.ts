import { ApiError } from "@/lib/api-error";
import {
  getMembersByIds,
  getMemberUserIds,
  softDeleteMembersByIds,
} from "@/repositories/member";
import type { Database } from "@uplog/db";
import type { CompanyMember } from "@uplog/db/types";
import type {
  BulkRemoveMembersBodyInput,
  BulkRemoveMembersParamInput,
} from "@uplog/types";
import { StatusCodes } from "@uplog/types/common/index";

export async function bulkRemoveMembersService(
  db: Database,
  userId: string,
  body: BulkRemoveMembersBodyInput,
  currentUserCompanyId: string,
  param: BulkRemoveMembersParamInput
) {
  const { memberIds } = body;
  const { companyId } = param;

  try {
    // Validate company access
    if (companyId !== currentUserCompanyId) {
      throw new ApiError("Unauthorized company access", StatusCodes.FORBIDDEN);
    }

    // Check if user is trying to remove themselves
    const companyMemberUserIds = await getMemberUserIds(
      db,
      currentUserCompanyId,
      memberIds
    );

    if (
      companyMemberUserIds.some((memberUser) => memberUser.userId === userId)
    ) {
      throw new ApiError(
        "You cannot remove yourself from the company.",
        StatusCodes.BAD_REQUEST
      );
    }

    return await db.transaction(async (tx) => {
      // Get members for validation
      const members = await getMembersByIds(
        tx,
        currentUserCompanyId,
        memberIds
      );

      if (members.length !== memberIds.length) {
        throw new ApiError(
          "One or more members do not belong to the company or are already deleted.",
          StatusCodes.BAD_REQUEST
        );
      }

      const hasOwner = members.some((m) => m.role === "OWNER");
      if (hasOwner) {
        throw new ApiError(
          "You cannot remove the company owner.",
          StatusCodes.BAD_REQUEST
        );
      }

      // Perform the soft delete
      const deletedMembers = await softDeleteMembersByIds(
        tx,
        currentUserCompanyId,
        memberIds
      );

      if (deletedMembers.length !== memberIds.length) {
        throw new ApiError(
          "Failed to remove all members.",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      return {
        deletedCount: deletedMembers.length,
        deletedMembers: deletedMembers.map((m) => ({
          id: m.id,
          userId: m.userId,
          role: m.role,
        })),
      };
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Error removing members:", error);
    throw new ApiError(
      "Failed to remove members",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
