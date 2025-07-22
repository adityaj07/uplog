import { ApiError } from "@/lib/api-error";
import { generateInviteCode } from "@/lib/invite";
import { canInviteRole } from "@/lib/role-permission";
import {
  checkExistingInvite,
  checkExistingMembership,
  createInvite,
  getUserCompanyMembership,
} from "@/repositories/invite";
import type { Database } from "@uplog/db";
import { StatusCodes } from "@uplog/types/common/index";
import type { CreateInviteInput } from "@uplog/types/invite";

export async function createInviteService(
  db: Database,
  userId: string,
  inviteData: CreateInviteInput
) {
  try {
    // 1. Get user's company membership and validate the permissions
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

    if (!canInviteRole(membership.role, inviteData.role)) {
      throw new ApiError(
        `Insufficient permissions to invite ${inviteData.role} role`,
        StatusCodes.FORBIDDEN
      );
    }

    // 2. For email invites, check if user already exists
    if (inviteData.type === "email") {
      const existingMember = await checkExistingMembership(
        db,
        inviteData.email,
        inviteData.companyId
      );

      if (existingMember) {
        throw new ApiError(
          "User is already a member of this company",
          StatusCodes.CONFLICT
        );
      }

      // Check for existing pending invite
      const existingInvite = await checkExistingInvite(
        db,
        inviteData.email,
        inviteData.companyId
      );

      if (existingInvite && new Date() < existingInvite.expiresAt) {
        throw new ApiError(
          "An active invite already exists for this email",
          StatusCodes.CONFLICT
        );
      }
    }

    // 3. Generate invite code and set expiration
    const code = generateInviteCode();
    const expiresAt =
      inviteData.type === "manual" && inviteData.expiresAt
        ? inviteData.expiresAt
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days default

    // Validate expiration is in future
    if (expiresAt <= new Date()) {
      throw new ApiError(
        "Expiration date must be in the future",
        StatusCodes.BAD_REQUEST
      );
    }

    // 4. Create the invite
    const newInvite = await createInvite(db, {
      companyId: inviteData.companyId,
      email: inviteData.type === "email" ? inviteData.email : undefined,
      code,
      role: inviteData.role,
      type: inviteData.type,
      expiresAt,
      invitedBy: userId,
    });

    return {
      invite: newInvite,
      inviteUrl:
        inviteData.type === "manual"
          ? `${process.env.FRONTEND_URL}/invite/${code}`
          : `${process.env.FRONTEND_URL}/invite/email?token=${code}`,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Error creating invite:", error);
    throw new ApiError(
      "Failed to create invite",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
