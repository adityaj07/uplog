import { DEFAULT_TAG_NAMES } from "@/lib/constants";
import { generateSlug } from "@/lib/generate-unique-slug";
import { company, tag, type Database } from "@uplog/db";
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
      inviteCode,
      setupComplete: false,
    })
    .returning();

  const newCompany = result[0];

  if (!newCompany) return null;

  const defaultTags = DEFAULT_TAG_NAMES.map((tagName) => ({
    tagName,
    tagSlug: generateSlug(tagName),
    companyId: newCompany.id,
  }));

  await db.insert(tag).values(defaultTags);

  return newCompany;
}
