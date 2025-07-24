import { ROLE_HIERARCHY } from "@/lib/role-permission";
import { StatusCodes } from "@uplog/types/common";
import type { Role } from "@uplog/types/invite";
import type { Context } from "hono";
import type { EnrichedContext, GuardResult } from "../types";

export function checkRole(
  c: Context<EnrichedContext>,
  minRole: Role
): GuardResult {
  const companyMember = c.get("companyMember");
  const reqId = c.get("requestId");

  if (!companyMember) {
    console.log(`[${reqId}] Role check failed - No company membership`);
    return {
      success: false,
      error: {
        code: StatusCodes.FORBIDDEN.code,
        label: StatusCodes.FORBIDDEN.label,
        message: "Company membership required",
        internal: "No company membership found",
      },
    };
  }

  const userLevel = ROLE_HIERARCHY[companyMember.role];
  const requiredLevel = ROLE_HIERARCHY[minRole];

  if (userLevel < requiredLevel) {
    console.log(
      `[${reqId}] Role check failed - User: ${companyMember.role} (${userLevel}), Required: ${minRole} (${requiredLevel})`
    );
    return {
      success: false,
      error: {
        code: StatusCodes.FORBIDDEN.code,
        label: StatusCodes.FORBIDDEN.label,
        message: `Minimum role required: ${minRole}`,
        internal: `User role: ${companyMember.role}, Required: ${minRole}`,
      },
    };
  }

  console.log(
    `[${reqId}] Role check passed - User: ${companyMember.role}, Required: ${minRole}`
  );
  return { success: true };
}
