import type { roleEnum } from "@uplog/db";

export const ROLE_HIERARCHY = {
  OWNER: 4,
  ADMIN: 3,
  EDITOR: 2,
  VIEWER: 1,
} as const;

export function canInviteRole(
  userRole: (typeof roleEnum.enumValues)[number],
  targetRole: (typeof roleEnum.enumValues)[number]
): boolean {
  const userLevel = ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY];
  const targetLevel = ROLE_HIERARCHY[targetRole as keyof typeof ROLE_HIERARCHY];

  // OWNER can invite anyone
  // ADMIN can invite EDITOR/VIEWER
  // Others cannot invite
  return userLevel >= 3 && userLevel >= targetLevel;
}
