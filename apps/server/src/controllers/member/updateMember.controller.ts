import type { HonoContext } from "@/ctx";
import { getDatabase } from "@/db";
import { ApiError } from "@/lib/api-error";
import { updateChangelogService } from "@/services/changelog/updateChangelog.service";
import { updateMemberService } from "@/services/member";
import type {
  ListMembersParamInput,
  UpdateMemberInput,
  UpdateMemberParamInput,
} from "@uplog/types";
import type {
  UpdateChangelogInput,
  UpdateChangelogParamInput,
} from "@uplog/types/changelog/index";
import { StatusCodes } from "@uplog/types/common/index";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export async function updateMember(c: Context<HonoContext>) {
  try {
    const sessionUser = c.var.sessionUser!;
    const sessionUserCompany = c.var.company!;
    const param = c.req.param() as unknown as UpdateMemberParamInput;
    const memberData = (await c.req.json()) as UpdateMemberInput;

    const db = getDatabase();
    const result = await updateMemberService(
      db,
      sessionUser.id,
      memberData,
      sessionUserCompany.id,
      param
    );

    return c.json({
      success: true,
      data: {
        result,
        message: `Successfully updated member role.`,
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
