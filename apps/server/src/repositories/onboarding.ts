import {
  company,
  companyMember,
  onboardingStatusEnum,
  roleEnum,
  user,
  type Database,
} from "@uplog/db";
import type { onboardingCompanyInput, onboardingUserInput } from "@uplog/types";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

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

export async function createCompany(
  db: Database,
  companyData: onboardingCompanyInput
) {
  const inviteCode = nanoid(12);

  const result = await db
    .insert(company)
    .values({
      name: companyData.name,
      subdomain: companyData.subdomain,
      website: companyData.website,
      logo: companyData.logo,
      brandColor: companyData.brandColor,
      layoutStyle: companyData.changelogpageLayout,
      inviteCode: inviteCode,
      setupComplete: false,
    })
    .returning();

  return result[0] || null;
}

export async function createCompanyMember(
  db: Database,
  userId: string,
  companyId: string,
  role: (typeof roleEnum.enumValues)[number] = "OWNER"
) {
  const result = await db
    .insert(companyMember)
    .values({
      userId: userId,
      companyId: companyId,
      role: role,
      status: "JOINED",
      joinedAt: new Date(),
    })
    .returning();

  return result[0] || null;
}

export async function checkSubdomainExists(db: Database, subdomain: string) {
  const result = await db
    .select({ id: company.id })
    .from(company)
    .where(eq(company.subdomain, subdomain))
    .limit(1);

  return result.length > 0;
}
