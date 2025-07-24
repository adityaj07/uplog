import { canInviteRole } from "@/lib/role-permission";
import { StatusCodes } from "@uplog/types/common";
import type { Context } from "hono";
import type { EnrichedContext, GuardResult } from "../types";

export function checkCanInvite(c: Context<EnrichedContext>): GuardResult {
  const companyMember = c.get("companyMember");
  const reqId = c.get("requestId");

  if (!companyMember) {
    console.log(
      `[${reqId}] Invite permission check failed - No company membership`
    );
    return {
      success: false,
      error: {
        code: StatusCodes.FORBIDDEN.code,
        label: StatusCodes.FORBIDDEN.label,
        message: "Company membership required",
        internal: "No company membership for invite permission check",
      },
    };
  }

  // Use existing canInviteRole logic - users who can invite VIEWER can invite
  const canInvite = canInviteRole(companyMember.role, "VIEWER");

  if (!canInvite) {
    console.log(
      `[${reqId}] Invite permission check failed - Role: ${companyMember.role}`
    );
    return {
      success: false,
      error: {
        code: StatusCodes.FORBIDDEN.code,
        label: StatusCodes.FORBIDDEN.label,
        message: "Insufficient permissions to invite users",
        internal: `User role: ${companyMember.role} cannot invite`,
      },
    };
  }

  console.log(
    `[${reqId}] Invite permission check passed - Role: ${companyMember.role}`
  );
  return { success: true };
}

// Add more permission checks as needed
export function checkSubscription(c: Context<EnrichedContext>): GuardResult {
  const subscription = c.get("subscription");
  const reqId = c.get("requestId");

  // TODO: Implement when subscription system is ready
  console.log(`[${reqId}] Subscription check - Not implemented yet`);
  return { success: true };
}
