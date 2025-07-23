import { invite, type Database } from "@uplog/db";
import { nanoid } from "nanoid";

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
