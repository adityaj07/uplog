import { ApiError } from "@/lib/api-error";
import { getUserCompanyMembership } from "@/repositories/invite";
import { updateMember } from "@/repositories/member";
import type { Database } from "@uplog/db";
import type { UpdateMemberInput, UpdateMemberParamInput } from "@uplog/types";
import { StatusCodes } from "@uplog/types/common/index";

export async function updateMemberService(
  db: Database,
  userId: string,
  memberRoleData: UpdateMemberInput,
  currentUserCompanyId: string,
  param: UpdateMemberParamInput
) {
  try {
    if (param.companyId !== currentUserCompanyId) {
      throw new ApiError("Unauthorized company access", StatusCodes.FORBIDDEN);
    }

    if (param.memberId !== userId) {
      throw new ApiError("Unauthorized user access", StatusCodes.FORBIDDEN);
    }

    if (param.memberId === userId) {
      throw new ApiError(
        "You cannot change your own role",
        StatusCodes.FORBIDDEN
      );
    }

    const targetMember = await getUserCompanyMembership(
      db,
      userId,
      currentUserCompanyId
    );
    if (!targetMember || targetMember.companyId !== currentUserCompanyId) {
      throw new ApiError("Unauthorized company access", StatusCodes.FORBIDDEN);
    }

    if (targetMember.role === "OWNER") {
      throw new ApiError(
        "Cannot change the role of an owner",
        StatusCodes.FORBIDDEN
      );
    }

    const result = await updateMember(
      db,
      userId,
      memberRoleData,
      currentUserCompanyId
    );

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
