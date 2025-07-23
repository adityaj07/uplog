import { companyMember, type Database, type roleEnum } from "@uplog/db";
import { nanoid } from "nanoid";

// Create company membership
export async function createCompanyMembership(
  db: Database,
  data: {
    userId: string;
    companyId: string;
    role: (typeof roleEnum.enumValues)[number];
    invitedBy?: string;
  }
) {
  const [membership] = await db
    .insert(companyMember)
    .values({
      id: nanoid(),
      userId: data.userId,
      companyId: data.companyId,
      role: data.role,
      status: "JOINED",
      invitedBy: data.invitedBy,
      invitedAt: new Date(),
      joinedAt: new Date(),
    })
    .returning();

  return membership;
}
