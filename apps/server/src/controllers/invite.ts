import type { HonoContext } from "@/ctx";
import { getDatabase } from "@/db";
import { ApiError } from "@/lib/api-error";
import {
  acceptInviteService,
  createInviteService,
  listInvitesService,
  validateInviteService,
} from "@/services/invite";
import { StatusCodes } from "@uplog/types/common";
import {
  type AcceptInviteInput,
  type CreateInviteInput,
  type ListInvitesQuery,
  type ValidateInviteQuery,
} from "@uplog/types/invite";
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
