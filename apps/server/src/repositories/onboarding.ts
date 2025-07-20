import { onboardingStatusEnum, user, type Database } from "@uplog/db";
import type { onboardingUserInput } from "@uplog/types";
import { eq } from "drizzle-orm";

export async function updateUserProfile(
  db: Database,
  userId: string,
  profileData: onboardingUserInput
) {
  const result = await db
    .update(user)
    .set({
      name: profileData.name,
      jobTitle: profileData.jobTitle,
      image: profileData.image,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId))
    .returning();

  return result[0] || 0;
}

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
