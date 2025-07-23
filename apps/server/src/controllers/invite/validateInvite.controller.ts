import type { HonoContext } from "@/ctx";
import { getDatabase } from "@/db";
import { ApiError } from "@/lib/api-error";
import { validateInviteService } from "@/services/invite";
import { StatusCodes } from "@uplog/types/common/index";
import type { ValidateInviteQuery } from "@uplog/types/invite/index";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export async function validateInvite(c: Context<HonoContext>) {
  try {
    const sessionUser = c.var.sessionUser; // Optional - can be null for public access
    const query = c.req.query() as unknown as ValidateInviteQuery;

    const db = getDatabase();
    const result = await validateInviteService(db, query.code, sessionUser?.id);

    console.log(
      "→ Validated invite:",
      result.status,
      "| Company:",
      result.invite.company.name,
      "| User:",
      sessionUser?.email || "anonymous"
    );

    return c.json({
      success: true,
      data: {
        ...result,
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
    console.error("Unexpected error in validateInvite:", error);
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
