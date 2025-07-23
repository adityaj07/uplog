import type { HonoContext } from "@/ctx";
import { getDatabase } from "@/db";
import { ApiError } from "@/lib/api-error";
import { acceptInviteService } from "@/services/invite";
import { StatusCodes } from "@uplog/types/common/index";
import type { AcceptInviteInput } from "@uplog/types/invite/index";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export async function acceptInvite(c: Context<HonoContext>) {
  try {
    const sessionUser = c.var.sessionUser!;
    const acceptData = c.req.json() as unknown as AcceptInviteInput;

    const db = getDatabase();
    const result = await acceptInviteService(db, sessionUser.id, acceptData);

    console.log(
      "→ Accepted invite:",
      result.role,
      "| Company:",
      result.company.name,
      "| User:",
      sessionUser.email
    );

    return c.json({
      success: true,
      data: {
        membership: {
          id: result.membership?.id,
          role: result.role,
          status: "JOINED",
          joinedAt: new Date(),
        },
        company: result.company,
        invitedBy: result.invitedBy,
        message: `Successfully joined ${result.company.name} as ${result.role}`,
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
    console.error("Unexpected error in acceptInvite:", error);
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
