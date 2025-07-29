import { ApiError } from "@/lib/api-error";
import { getMemberByUserId, softDeleteMemberById } from "@/repositories/member";
import type { Database } from "@uplog/db";
import type { LeaveCompanyParamInput } from "@uplog/types";
import { StatusCodes } from "@uplog/types/common/index";

export async function leaveMemberCompanyService(
  db: Database,
  userId: string,
  currentUserCompanyId: string,
  param: LeaveCompanyParamInput
) {
  const { companyId } = param;

  try {
    // Validate company access
    if (companyId !== currentUserCompanyId) {
      throw new ApiError("Unauthorized company access", StatusCodes.FORBIDDEN);
    }

    const member = await getMemberByUserId(db, userId, currentUserCompanyId);

    if (!member || member.deletedAt) {
      throw new ApiError(
        "You are not an active member of this company.",
        StatusCodes.BAD_REQUEST
      );
    }

    if (member.role === "OWNER") {
      throw new ApiError(
        "Owners cannot leave the company. Transfer ownership first.",
        StatusCodes.FORBIDDEN
      );
    }

    const result = await softDeleteMemberById(db, currentUserCompanyId, userId);

    return result[0];
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
