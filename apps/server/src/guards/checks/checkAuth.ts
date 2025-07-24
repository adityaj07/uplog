import { StatusCodes } from "@uplog/types/common";
import type { Context } from "hono";
import type { EnrichedContext, GuardResult } from "../types";

export function checkAuth(c: Context<EnrichedContext>): GuardResult {
  const sessionUser = c.get("sessionUser");
  const reqId = c.get("requestId");

  if (!sessionUser) {
    console.log(`[${reqId}] Auth check failed - No session user`);
    return {
      success: false,
      error: {
        code: StatusCodes.UNAUTHORIZED.code,
        label: StatusCodes.UNAUTHORIZED.label,
        message: "Authentication required",
        internal: "No session user found",
      },
    };
  }

  console.log(`[${reqId}] Auth check passed for user: ${sessionUser.id}`);
  return { success: true };
}
