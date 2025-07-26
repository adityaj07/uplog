import { getDatabase } from "@/db";
import type { EnrichedContext } from "@/guards/types";
import { ApiError } from "@/lib/api-error";
import { listMembersService } from "@/services/member";
import type { ListMembersParamInput, ListMembersQuery } from "@uplog/types";
import { StatusCodes } from "@uplog/types/common/index";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export async function listMembers(c: Context<EnrichedContext>) {
  try {
    const sessionUser = c.var.sessionUser!;
    const sessionUserCompany = c.var.company!;
    const param = c.req.param() as unknown as ListMembersParamInput;
    const query = c.req.query() as unknown as ListMembersQuery;

    if (param.id !== sessionUserCompany.id) {
      return c.json({
        success: false,
        data: {
          message: `Unauthorized company access`,
        },
        status: StatusCodes.FORBIDDEN,
      });
    }

    const db = getDatabase();
    const result = await listMembersService(
      db,
      sessionUser.id,
      sessionUserCompany.id,
      query
    );

    return c.json({
      success: true,
      data: {
        result,
        message: `Found ${result.members.length} members`,
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
    console.error("Unexpected error in listMembers:", error);
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
