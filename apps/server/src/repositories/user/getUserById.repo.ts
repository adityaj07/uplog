import { company, companyMember, user, type Database } from "@uplog/db";
import { eq } from "drizzle-orm";

export async function getUserById(db: Database, userId: string) {
  const rows = await db
    .select({
      user,
      member: companyMember,
      company,
    })
    .from(user)
    .leftJoin(companyMember, eq(companyMember.userId, user.id))
    .leftJoin(company, eq(company.id, companyMember.companyId))
    .where(eq(user.id, userId));

  const userAcc = rows[0];
  if (!userAcc) return null;

  return {
    user: userAcc.user,
    member: userAcc.member,
    company: userAcc.company,
  };
}
