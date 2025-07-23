import type { HonoContext } from "@/ctx";
import { getDatabase } from "@/db";
import { ApiError } from "@/lib/api-error";
import { listInvitesService } from "@/services/invite";
import { StatusCodes } from "@uplog/types/common/index";
import type { ListInvitesQuery } from "@uplog/types/invite/index";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export async function listInvites(c: Context<HonoContext>) {
  try {
    const sessionUser = c.var.sessionUser!;
    const query = c.req.query() as unknown as ListInvitesQuery;

    const db = getDatabase();
    const result = await listInvitesService(db, sessionUser.id, query);

    console.log(
      "→ Listed invites:",
      result.invites.length,
      "| Company:",
      result.companyName,
      "| By:",
      sessionUser.email
    );

    return c.json({
      success: true,
      data: {
        invites: result.invites,
        pagination: result.pagination,
        companyName: result.companyName,
        message: `Found ${result.invites.length} invites`,
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
    console.error("Unexpected error in listInvites:", error);
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
