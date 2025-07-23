import { ApiError } from "@/lib/api-error";
import {
  checkUserCompanyMembership,
  getInviteByCode,
} from "@/repositories/invite";
import { user, type Database } from "@uplog/db";
import { StatusCodes } from "@uplog/types/common/index";
import { eq } from "drizzle-orm";

export async function validateInviteService(
  db: Database,
  code: string,
  userId?: string // Optional - if user is logged in
) {
  try {
    // 1. Get invite by code
    const inviteData = await getInviteByCode(db, code);

    if (!inviteData) {
      throw new ApiError("Invalid invite code", StatusCodes.NOT_FOUND);
    }

    // 2. Check if invite is revoked
    if (inviteData.revoked) {
      throw new ApiError("This invite has been revoked", StatusCodes.FORBIDDEN);
    }

    // 3. Check if invite is expired
    const now = new Date();
    if (new Date(inviteData.expiresAt) < now) {
      throw new ApiError("This invite has expired", StatusCodes.GONE);
    }

    // 4. Check if invite is already used (for single-use invites)
    if (inviteData.usedAt && inviteData.maxUses <= inviteData.useCount) {
      throw new ApiError("This invite has already been used", StatusCodes.GONE);
    }

    // 5. For email invites, check if user is logged in and email matches
    let emailMismatch = false;
    if (inviteData.type === "email" && inviteData.email && userId) {
      // Get user's email to compare
      const userEmail = await db.query.user.findFirst({
        where: eq(user.id, userId),
        columns: { email: true },
      });

      if (userEmail && userEmail?.email !== inviteData.email) {
        emailMismatch = true;
      }
    }

    // 6. Check if user is already a member (if logged in)
    let existingMembership = null;
    if (userId) {
      existingMembership = await checkUserCompanyMembership(
        db,
        userId,
        inviteData.companyId
      );
    }

    // 7. Determine invite status and validity
    let validationStatus: "valid" | "invalid" | "warning";
    let message: string;
    let warnings: string[] = [];

    if (existingMembership) {
      if (existingMembership.status === "JOINED") {
        validationStatus = "invalid";
        message = "You are already a member of this company";
      } else {
        validationStatus = "warning";
        message = "You have a pending membership for this company";
        warnings.push(
          "You have a pending membership that needs to be activated"
        );
      }
    } else if (emailMismatch) {
      validationStatus = "warning";
      message = "This invite was sent to a different email address";
      warnings.push(`This invite was sent to ${inviteData.email}`);
    } else {
      validationStatus = "valid";
      message =
        inviteData.type === "email"
          ? `You're invited to join ${inviteData.company.name} as ${inviteData.role}`
          : `Join ${inviteData.company.name} as ${inviteData.role}`;
    }

    return {
      valid: validationStatus === "valid",
      status: validationStatus,
      message,
      warnings,
      invite: {
        id: inviteData.id,
        type: inviteData.type,
        role: inviteData.role,
        email: inviteData.email,
        expiresAt: inviteData.expiresAt,
        company: {
          id: inviteData.company.id,
          name: inviteData.company.name,
          logo: inviteData.company.logo,
          brandColor: inviteData.company.brandColor,
        },
        invitedBy: inviteData.invitedBy
          ? {
              name: inviteData.invitedBy.name,
              email: inviteData.invitedBy.email,
            }
          : null,
        requiresEmail: inviteData.type === "email" && !userId,
        emailMismatch,
      },
      userMembership: existingMembership
        ? {
            role: existingMembership.role,
            status: existingMembership.status,
          }
        : null,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Error validating invite:", error);
    throw new ApiError(
      "Failed to validate invite",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
