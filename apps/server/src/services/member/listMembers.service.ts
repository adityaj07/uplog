import { ApiError } from "@/lib/api-error";
import { listMembers } from "@/repositories/member";
import type { Database } from "@uplog/db";
import type { ListMembersQuery } from "@uplog/types";
import { StatusCodes } from "@uplog/types/common/index";

export async function listMembersService(
  db: Database,
  userId: string,
  currentUserCompanyId: string,
  query: ListMembersQuery
) {
  try {
    const result = await listMembers(db, userId, currentUserCompanyId, query);

    const { members, total, page, limit, hasMore } = result;

    return {
      members,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore,
      },
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Error fetching members:", error);
    throw new ApiError(
      "Failed to fetch members",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
