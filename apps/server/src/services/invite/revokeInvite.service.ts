import { ApiError } from "@/lib/api-error";
import {
  getInviteById,
  getUserCompanyMembership,
  revokeInvite,
} from "@/repositories/invite";
import type { Database } from "@uplog/db";
import { StatusCodes } from "@uplog/types/common/index";
import type { RevokeInviteInput } from "@uplog/types/invite/index";

export async function revokeInviteService(
  db: Database,
  userId: string,
  revokeData: RevokeInviteInput
) {
  try {
    // 1. Get the invite with company details
    const inviteData = await getInviteById(db, revokeData.inviteId);

    if (!inviteData) {
      throw new ApiError("Invite not found", StatusCodes.NOT_FOUND);
    }

    // 2. Check if invite is already revoked
    if (inviteData.revoked) {
      throw new ApiError(
        "This invite has already been revoked",
        StatusCodes.CONFLICT
      );
    }

    // 3. Check if invite is already used
    if (inviteData.usedAt) {
      throw new ApiError(
        "Cannot revoke an invite that has already been used",
        StatusCodes.CONFLICT
      );
    }

    // 4. Verify user has permission to revoke invites for this company
    const membership = await getUserCompanyMembership(
      db,
      userId,
      inviteData.companyId
    );

    if (!membership) {
      throw new ApiError(
        "You are not a member of this company",
        StatusCodes.FORBIDDEN
      );
    }

    if (!["OWNER", "ADMIN"].includes(membership.role)) {
      throw new ApiError(
        "Insufficient permissions to revoke invites",
        StatusCodes.FORBIDDEN
      );
    }

    // 5. Additional permission check: ADMIN can only revoke invites for EDITOR/VIEWER roles
    if (membership.role === "ADMIN") {
      if (["OWNER", "ADMIN"].includes(inviteData.role)) {
        throw new ApiError(
          `You cannot revoke invites for ${inviteData.role} role`,
          StatusCodes.FORBIDDEN
        );
      }
    }

    // 6. Check if the invite is expired (optional warning)
    const now = new Date();
    const isExpired = new Date(inviteData.expiresAt) < now;

    // 7. Revoke the invite
    await revokeInvite(db, revokeData.inviteId, userId);

    return {
      success: true,
      invite: {
        id: inviteData.id,
        email: inviteData.email,
        role: inviteData.role,
        type: inviteData.type,
        expiresAt: inviteData.expiresAt,
        wasExpired: isExpired,
      },
      company: {
        id: inviteData.company.id,
        name: inviteData.company.name,
      },
      message: isExpired
        ? `Revoked expired invite for ${inviteData.email || "manual invite"}`
        : `Revoked invite for ${inviteData.email || "manual invite"}`,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Error revoking invite:", error);
    throw new ApiError(
      "Failed to revoke invite",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
