import { invite, type Database } from "@uplog/db";
import { and, count, desc, eq, gte, isNotNull, isNull, lt } from "drizzle-orm";

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
