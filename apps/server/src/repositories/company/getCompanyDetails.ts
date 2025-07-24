import { type Database } from "@uplog/db";

export async function getCompanyDetails(db: Database, companyId: string) {
  // Load company details
  const company = await db.query.company.findFirst({
    where: (company, { eq }) => eq(company.id, companyId),
  });

  return company;
}
