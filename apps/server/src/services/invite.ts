import { ApiError } from "@/lib/api-error";
import { sendInviteEmail } from "@/lib/email";
import { generateInviteCode } from "@/lib/invite";
import { canInviteRole } from "@/lib/role-permission";
import {
  checkExistingInvite,
  checkExistingMembership,
  createInvite,
  getUserCompanyId,
  getUserCompanyMembership,
  listCompanyInvites,
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

    // we check if the user has permissions to send invitation
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

    // 5. Send email if type is "email"
    if (inviteData.type === "email" && inviteData.email) {
      await sendInviteEmail({
        to: inviteData.email,
        inviteUrl: `${process.env.FRONTEND_URL}/invite/email?token=${code}`,
        companyName: membership.company.name,
        role: inviteData.role,
      });
    }

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

export async function listInvitesService(
  db: Database,
  userId: string,
  options: {
    page?: number;
    limit?: number;
    status?: "active" | "expired" | "revoked" | "used";
  }
) {
  try {
    // 1. Get user's company ID
    const companyId = await getUserCompanyId(db, userId);
    if (!companyId) {
      throw new ApiError(
        "You are not a member of any company",
        StatusCodes.FORBIDDEN
      );
    }

    // 2. Verify user has admin permissions
    const membership = await getUserCompanyMembership(db, userId, companyId);
    if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) {
      throw new ApiError(
        "Insufficient permissions to view invites",
        StatusCodes.FORBIDDEN
      );
    }

    // 3. Validate and set pagination options
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(50, Math.max(1, options.limit || 10)); // Max 50 per page
    const offset = (page - 1) * limit;

    // 4. Get invites
    const result = await listCompanyInvites(db, companyId, {
      limit,
      offset,
      status: options.status,
    });

    // 5. Transform invites to include computed status
    const now = new Date();
    const transformedInvites = result.invites.map((invite) => {
      let computedStatus: "active" | "expired" | "revoked" | "used";

      if (invite.revoked) {
        computedStatus = "revoked";
      } else if (invite.usedAt) {
        computedStatus = "used";
      } else if (new Date(invite.expiresAt) < now) {
        computedStatus = "expired";
      } else {
        computedStatus = "active";
      }

      return {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        type: invite.type,
        status: computedStatus,
        expiresAt: invite.expiresAt,
        invitedAt: invite.invitedAt,
        usedAt: invite.usedAt,
        invitedBy: invite.invitedBy
          ? {
              id: invite.invitedBy.id,
              name: invite.invitedBy.name,
              email: invite.invitedBy.email,
            }
          : null,
        // Don't expose the actual invite code for security
        inviteUrl:
          computedStatus === "active"
            ? invite.type === "manual"
              ? `${process.env.FRONTEND_URL}/invite/${invite.code}`
              : `${process.env.FRONTEND_URL}/invite/email?token=${invite.code}`
            : null,
      };
    });

    return {
      invites: transformedInvites,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
        hasMore: result.hasMore,
      },
      companyName: membership.company.name,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Error listing invites:", error);
    throw new ApiError(
      "Failed to list invites",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
