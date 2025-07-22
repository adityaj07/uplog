import { companyMember, invite, type Database } from "@uplog/db";
import { and, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

// Get user's company membership with role
export async function getUserCompanyMembership(
  db: Database,
  userId: string,
  companyId: string
) {
  const membership = await db.query.companyMember.findFirst({
    where: and(
      eq(companyMember.userId, userId),
      eq(companyMember.companyId, companyId),
      eq(companyMember.status, "JOINED")
    ),
    with: {
      company: true,
    },
  });
  return membership;
}

// Check if user already has membership (prevent duplicates)
export async function checkExistingMembership(
  db: Database,
  email: string,
  companyId: string
) {
  const existingMember = await db.query.companyMember.findFirst({
    where: and(eq(companyMember.companyId, companyId)),
    with: {
      user: true,
    },
  });

  return existingMember?.user?.email === email ? existingMember : null;
}

// Check for existing pending invite
export async function checkExistingInvite(
  db: Database,
  email: string | null,
  companyId: string
) {
  const where = email
    ? and(
        eq(invite.email, email),
        eq(invite.companyId, companyId),
        eq(invite.revoked, false)
      )
    : eq(invite.companyId, companyId);

  const result = await db.query.invite.findMany({
    where,
    orderBy: desc(invite.invitedAt),
    limit: 1,
  });

  return result[0];
}

// Create invite record
export async function createInvite(
  db: Database,
  data: {
    companyId: string;
    email?: string;
    code: string;
    role: "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";
    type: "email" | "manual";
    expiresAt: Date;
    invitedBy: string;
  }
) {
  const [newInvite] = await db
    .insert(invite)
    .values({
      id: nanoid(),
      companyId: data.companyId,
      email: data.email || null,
      code: data.code,
      role: data.role,
      type: data.type,
      expiresAt: data.expiresAt,
      usedAt: null,
      invitedBy: data.invitedBy,
    })
    .returning();

  return newInvite;
}
