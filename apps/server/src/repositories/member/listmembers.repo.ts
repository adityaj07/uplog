import { companyMember, user, type Database } from "@uplog/db";
import type { ListMembersQuery } from "@uplog/types";
import { and, desc, eq, ilike, isNull, sql } from "drizzle-orm";

export async function listMembers(
  db: Database,
  userId: string,
  companyId: string,
  query: ListMembersQuery
) {
  const {
    search,
    status,
    role,
    sort = "createdAt",
    order = "desc",
    page = 1,
    limit = 10,
  } = query;

  const offset = (page - 1) * limit;
  const whereMemberOnly = [
    eq(companyMember.companyId, companyId),
    isNull(companyMember.deletedAt), // Exclude soft-deleted members
    isNull(user.deletedAt), // Exclude soft-deleted users
  ];

  if (status) whereMemberOnly.push(eq(companyMember.status, status));
  if (role) whereMemberOnly.push(eq(companyMember.role, role));

  // Only add this when user search is present
  const whereWithUserSearch = [...whereMemberOnly];
  if (search) whereWithUserSearch.push(ilike(user.name, `%${search}%`));

  const where = and(...(search ? whereWithUserSearch : whereMemberOnly));

  const [members, [{ total }]] = await Promise.all([
    db
      .select({
        userName: user.name,
        userEmail: user.email,
        userEmailVerified: user.emailVerified,
        userImage: user.image,
        userJobTitle: user.jobTitle,
        userOnboardingStatus: user.onboardingStatus,
        companyMemberId: companyMember.id,
        companyMemberRole: companyMember.role,
        companyMemberStatus: companyMember.status,
        companyMemberInvitedBy: companyMember.invitedBy,
        companyMemberInvitedAt: companyMember.invitedAt,
        companyMemberJoinedAt: companyMember.joinedAt,
      })
      .from(companyMember)
      .leftJoin(user, eq(user.id, companyMember.userId))
      .where(where)
      .orderBy(
        order === "asc" ? companyMember[sort] : desc(companyMember[sort])
      )
      .offset(offset)
      .limit(limit),

    search
      ? db
          .select({ total: sql<number>`count(*)` })
          .from(companyMember)
          .leftJoin(user, eq(user.id, companyMember.userId))
          .where(where)
      : db
          .select({ total: sql<number>`count(*)` })
          .from(companyMember)
          .leftJoin(user, eq(user.id, companyMember.userId))
          .where(and(...whereMemberOnly)),
  ]);

  const hasMore = page * limit < total;

  return {
    members,
    total,
    hasMore,
    page,
    limit,
  };
}
