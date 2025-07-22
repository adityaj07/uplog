import {
  companyMember,
  invite,
  roleEnum,
  user,
  type Database,
} from "@uplog/db";
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

// Get invite by code for validation (public endpoint)
export async function getInviteByCode(db: Database, code: string) {
  const inviteData = await db.query.invite.findFirst({
    where: eq(invite.code, code),
    with: {
      company: {
        columns: {
          id: true,
          name: true,
          logo: true,
          brandColor: true,
        },
      },
      invitedBy: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return inviteData;
}

// Check if user is already a member of the company (for validation)
export async function checkUserCompanyMembership(
  db: Database,
  userId: string,
  companyId: string
) {
  const membership = await db.query.companyMember.findFirst({
    where: and(
      eq(companyMember.userId, userId),
      eq(companyMember.companyId, companyId)
    ),
    columns: {
      id: true,
      role: true,
      status: true,
    },
  });

  return membership;
}

// Mark invite as used
export async function markInviteAsUsed(
  db: Database,
  inviteId: string
): Promise<void> {
  await db
    .update(invite)
    .set({
      usedAt: new Date(),
      useCount: 1, // For single-use invites
      updatedAt: new Date(),
    })
    .where(eq(invite.id, inviteId));
}

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

// Get user by email (for email invite validation)
export async function getUserByEmail(db: Database, email: string) {
  return await db.query.user.findFirst({
    where: eq(user.email, email),
    columns: {
      id: true,
      email: true,
      name: true,
    },
  });
}

// Get invite by ID with company details (for revoke validation)
export async function getInviteById(db: Database, inviteId: string) {
  const inviteData = await db.query.invite.findFirst({
    where: eq(invite.id, inviteId),
    with: {
      company: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });

  return inviteData;
}

// Revoke invite
export async function revokeInvite(
  db: Database,
  inviteId: string,
  revokedBy: string
): Promise<void> {
  await db
    .update(invite)
    .set({
      revoked: true,
      updatedAt: new Date(),
      // Optional: store who revoked it
      // revokedBy: revokedBy,
      // revokedAt: new Date(),
    })
    .where(eq(invite.id, inviteId));
}
