import { ApiError } from "@/lib/api-error";
import { getUserById } from "@/repositories/users";
import type { Database } from "@uplog/db";
import type { onboardingUserInput } from "@uplog/types";
import { StatusCodes } from "@uplog/types/common/index";

export async function getCurrentUserService(db: Database, userId: string) {
  const user = await getUserById(db, userId);
  if (!user) {
    throw new ApiError("User not found", StatusCodes.NOT_FOUND);
  }
  return user;
}
