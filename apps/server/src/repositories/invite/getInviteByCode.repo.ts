import { invite, type Database } from "@uplog/db";
import { eq } from "drizzle-orm";

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
