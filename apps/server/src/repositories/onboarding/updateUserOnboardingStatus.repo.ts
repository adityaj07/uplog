import { user, type Database, type onboardingStatusEnum } from "@uplog/db";
import { eq } from "drizzle-orm";

export async function updateUserOnboardingStatus(
  db: Database,
  userId: string,
  status: (typeof onboardingStatusEnum.enumValues)[number]
) {
  const result = await db
    .update(user)
    .set({
      onboardingStatus: status,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId))
    .returning();

  return result[0] || null;
}
