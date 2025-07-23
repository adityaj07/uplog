import type { HonoContext } from "@/ctx";
import { getDatabase } from "@/db";
import { ApiError } from "@/lib/api-error";
import { createCompanyService } from "@/services/onboarding";
import type { onboardingCompanyInput } from "@uplog/types";
import { StatusCodes } from "@uplog/types/common/index";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export async function onboardingCompany(c: Context<HonoContext>) {
  try {
    const sessionUser = c.var.sessionUser!;
    const companyData = await c.req.json<onboardingCompanyInput>();

    const db = getDatabase();
    const result = await createCompanyService(db, sessionUser.id, companyData);

    console.log(
      "→ Company created for user:",
      sessionUser.email,
      "| Company:",
      result.company.name
    );

    return c.json({
      success: true,
      data: {
        company: result.company,
        membership: result.membership,
        inviteLink: result.inviteLink,
        message: "Company created successfully",
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
    console.error("Unexpected error in onboardingCompany:", error);
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
