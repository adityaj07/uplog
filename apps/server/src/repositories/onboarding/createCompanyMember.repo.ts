import { companyMember, type Database, type roleEnum } from "@uplog/db";

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
