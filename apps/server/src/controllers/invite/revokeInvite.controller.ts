import type { HonoContext } from "@/ctx";
import { getDatabase } from "@/db";
import { ApiError } from "@/lib/api-error";
import { revokeInviteService } from "@/services/invite";
import { StatusCodes } from "@uplog/types/common/index";
import type { RevokeInviteInput } from "@uplog/types/invite/index";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export async function revokeInvite(c: Context<HonoContext>) {
  try {
    const sessionUser = c.var.sessionUser!;
    // const revokeData = c.req.valid("json") as RevokeInviteInput;
    const revokeData = c.req.json() as unknown as RevokeInviteInput;

    const db = getDatabase();
    const result = await revokeInviteService(db, sessionUser.id, revokeData);

    console.log(
      "→ Revoked invite:",
      result.invite.id,
      "| Role:",
      result.invite.role,
      "| Company:",
      result.company.name,
      "| By:",
      sessionUser.email
    );

    return c.json({
      success: true,
      data: {
        invite: {
          id: result.invite.id,
          email: result.invite.email,
          role: result.invite.role,
          type: result.invite.type,
          expiresAt: result.invite.expiresAt,
          status: "revoked",
          wasExpired: result.invite.wasExpired,
        },
        company: result.company,
        message: result.message,
      },
      status: StatusCodes.OK,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return c.json(
        {
          error: error.message,
          code: error.code,
          label: error.label,
          details: error.details ?? null,
        },
        error.status as ContentfulStatusCode
      );
    }

    // Handle unexpected errors
    console.error("Unexpected error in revokeInvite:", error);
    return c.json(
      {
        error: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
        label: "INTERNAL_SERVER_ERROR",
        details: null,
      },
      StatusCodes.INTERNAL_SERVER_ERROR.code
    );
  }
}
