import { ApiError } from "@/lib/api-error";
import {
  checkUserCompanyMembership,
  createCompanyMembership,
  getInviteByCode,
  getUserCompanyMembership,
  markInviteAsUsed,
} from "@/repositories/invite";
import { getCurrentUser } from "@/repositories/user";
import { companyMember, user, type Database } from "@uplog/db";
import { StatusCodes } from "@uplog/types/common/index";
import type { AcceptInviteInput } from "@uplog/types/invite/index";
import { eq } from "drizzle-orm";

export async function acceptInviteService(
  db: Database,
  userId: string,
  acceptData: AcceptInviteInput
) {
  try {
    // 1. Get the invite by code
    const inviteData = await getInviteByCode(db, acceptData.code);

    if (!inviteData) {
      throw new ApiError("Invalid invite code", StatusCodes.NOT_FOUND);
    }

    // 2. Validate invite status
    if (inviteData.revoked) {
      throw new ApiError("This invite has been revoked", StatusCodes.FORBIDDEN);
    }

    if (new Date() > new Date(inviteData.expiresAt)) {
      throw new ApiError("This invite has expired", StatusCodes.GONE);
    }

    if (inviteData.usedAt) {
      throw new ApiError(
        "This invite has already been used",
        StatusCodes.CONFLICT
      );
    }

    // 3. Get current user details
    const currentUser = await getCurrentUser(db, userId);

    if (!currentUser) {
      throw new ApiError("User not found", StatusCodes.NOT_FOUND);
    }

    // 4. For email invites, validate email matches
    if (inviteData.type === "email" && inviteData.email) {
      if (currentUser.email !== inviteData.email) {
        throw new ApiError(
          `This invite was sent to ${inviteData.email}. Please log in with the correct email or ask for a new invite.`,
          StatusCodes.FORBIDDEN
        );
      }
    }

    // 5. Check if user is already a member
    const existingMembership = await checkUserCompanyMembership(
      db,
      userId,
      inviteData.companyId
    );

    if (existingMembership) {
      if (existingMembership.status === "JOINED") {
        throw new ApiError(
          "You are already a member of this company",
          StatusCodes.CONFLICT
        );
      } else {
        // Update existing pending membership to JOINED
        await db
          .update(companyMember)
          .set({
            status: "JOINED",
            role: inviteData.role, // Update role from invite
            joinedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(companyMember.id, existingMembership.id));
      }
    } else {
      // 6. Create new company membership
      await createCompanyMembership(db, {
        userId,
        companyId: inviteData.companyId,
        role: inviteData.role,
        invitedBy: inviteData.invitedBy || undefined,
      });
    }

    // 7. Mark invite as used
    await markInviteAsUsed(db, inviteData.id);

    // 8. Get the updated membership details
    const newMembership = await getUserCompanyMembership(
      db,
      userId,
      inviteData.companyId
    );

    return {
      success: true,
      membership: newMembership,
      company: {
        id: inviteData.company.id,
        name: inviteData.company.name,
        logo: inviteData.company.logo,
        brandColor: inviteData.company.brandColor,
      },
      role: inviteData.role,
      invitedBy: inviteData.invitedBy
        ? {
            name: inviteData.invitedBy.name,
            email: inviteData.invitedBy.email,
          }
        : null,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Error accepting invite:", error);
    throw new ApiError(
      "Failed to accept invite",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
