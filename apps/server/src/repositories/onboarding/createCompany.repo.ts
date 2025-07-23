import { company, type Database } from "@uplog/db";
import type { onboardingCompanyInput } from "@uplog/types";
import { nanoid } from "nanoid";

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
