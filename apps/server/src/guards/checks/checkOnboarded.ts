import { StatusCodes } from "@uplog/types/common";
import type { Context } from "hono";
import type { EnrichedContext, GuardResult } from "../types";

export function checkOnboarded(c: Context<EnrichedContext>): GuardResult {
  const company = c.get("company");
  const companyMember = c.get("companyMember");
  const reqId = c.get("requestId");

  if (!company || !companyMember) {
    console.log(
      `[${reqId}] Onboarding check failed - Missing company or membership`
    );
    return {
      success: false,
      error: {
        code: StatusCodes.FORBIDDEN.code,
        label: StatusCodes.FORBIDDEN.label,
        message: "Complete onboarding to access this resource",
        internal: `Company: ${!!company}, Member: ${!!companyMember}`,
      },
    };
  }

  if (companyMember.status !== "JOINED") {
    console.log(
      `[${reqId}] Onboarding check failed - Member status: ${companyMember.status}`
    );
    return {
      success: false,
      error: {
        code: StatusCodes.FORBIDDEN.code,
        label: StatusCodes.FORBIDDEN.label,
        message: "Complete your membership to access this resource",
        internal: `Member status: ${companyMember.status}`,
      },
    };
  }

  console.log(`[${reqId}] Onboarding check passed - Company: ${company.name}`);
  return { success: true };
}
