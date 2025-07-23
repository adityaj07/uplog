import { company, type Database } from "@uplog/db";
import { eq } from "drizzle-orm";

export async function checkSubdomainExists(db: Database, subdomain: string) {
  const result = await db
    .select({ id: company.id })
    .from(company)
    .where(eq(company.subdomain, subdomain))
    .limit(1);

  return result.length > 0;
}
