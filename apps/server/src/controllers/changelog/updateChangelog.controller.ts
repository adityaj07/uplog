import type { HonoContext } from "@/ctx";
import { getDatabase } from "@/db";
import { ApiError } from "@/lib/api-error";
import { updateChangelogService } from "@/services/changelog/updateChangelog.service";
import type {
  UpdateChangelogInput,
  UpdateChangelogParamInput,
} from "@uplog/types/changelog/index";
import { StatusCodes } from "@uplog/types/common/index";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export async function updateChangelog(c: Context<HonoContext>) {
  try {
    const sessionUser = c.var.sessionUser!;
    const sessionUserCompany = c.var.company!;
    const param = c.req.param() as unknown as UpdateChangelogParamInput;
    const changelogData = (await c.req.json()) as UpdateChangelogInput;

    const db = getDatabase();
    const result = await updateChangelogService(
      db,
      sessionUser.id,
      changelogData,
      sessionUserCompany.id,
      param.id
    );

    return c.json({
      success: true,
      data: {
        result,
        message: `Successfully updated changelog.`,
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
