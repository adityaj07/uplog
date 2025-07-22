import type { HonoContext } from "@/ctx";
import { getDatabase } from "@/db";
import { ApiError } from "@/lib/api-error";
import { createInviteService } from "@/services/invite";
import { StatusCodes } from "@uplog/types/common";
import { type CreateInviteInput } from "@uplog/types/invite";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export async function createInvite(c: Context<HonoContext>) {
  try {
    const sessionUser = c.var.sessionUser!;
    const inviteData = await c.req.json<CreateInviteInput>();

    const db = getDatabase();
    const result = await createInviteService(db, sessionUser.id, inviteData);

    return c.json({
      success: true,
      data: {
        invite: {
          id: result.invite.id,
          code: result.invite.code,
          role: result.invite.role,
          type: result.invite.type,
          email: result.invite.email,
          expiresAt: result.invite.expiresAt,
          inviteUrl: result.inviteUrl,
        },
        message: `${
          result.invite.type === "email" ? "Email" : "Manual"
        } invite created successfully`,
      },
      status: StatusCodes.CREATED,
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
    console.error("Unexpected error in createInvite:", error);
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
