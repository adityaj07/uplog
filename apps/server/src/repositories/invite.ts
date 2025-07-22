import { companyMember, invite, type Database } from "@uplog/db";
import { and, count, desc, eq, gte, isNotNull, isNull, lt } from "drizzle-orm";
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

export async function getUserCompanyId(
  db: Database,
  userId: string
): Promise<string | null> {
  const membership = await db.query.companyMember.findFirst({
    where: and(
      eq(companyMember.userId, userId),
      eq(companyMember.status, "JOINED")
    ),
    columns: { companyId: true },
  });

  return membership?.companyId || null;
}

// List invites for a company with pagination and filtering
export async function listCompanyInvites(
  db: Database,
  companyId: string,
  options: {
    limit: number;
    offset: number;
    status?: "active" | "expired" | "revoked" | "used";
  }
) {
  const { limit, offset, status } = options;
  const now = new Date();

  // we build where conditions based on status filter
  let whereConditions = and(eq(invite.companyId, companyId));

  if (status) {
    switch (status) {
      case "active":
        whereConditions = and(
          whereConditions,
          eq(invite.revoked, false),
          isNull(invite.usedAt),
          gte(invite.expiresAt, now)
        );
        break;
      case "expired":
        whereConditions = and(
          whereConditions,
          eq(invite.revoked, false),
          isNull(invite.usedAt),
          lt(invite.expiresAt, now)
        );
        break;
      case "revoked":
        whereConditions = and(whereConditions, eq(invite.revoked, true));
        break;
      case "used":
        whereConditions = and(
          whereConditions,
          eq(invite.revoked, false),
          isNotNull(invite.usedAt)
        );
        break;
    }
  }

  // Get invites with pagination
  const invites = await db.query.invite.findMany({
    where: whereConditions,
    orderBy: desc(invite.invitedAt),
    limit,
    offset,
    with: {
      invitedBy: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Get total count for pagination
  const [totalCount] = await db
    .select({ count: count() })
    .from(invite)
    .where(whereConditions);

  return {
    invites,
    total: totalCount.count,
    hasMore: offset + limit < totalCount.count,
  };
}
