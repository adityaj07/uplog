import { type Database } from "@uplog/db";

export async function getMemberUserIds(
  db: Database,
  companyId: string,
  memberIds: string[]
) {
  const result = await db.query.companyMember.findMany({
    where: (member, { inArray, eq }) =>
      inArray(member.id, memberIds) && eq(member.companyId, companyId),
    columns: { userId: true },
  });

  return result;
}
