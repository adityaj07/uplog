import crypto from "crypto";

// Generate secure invite code
export function generateInviteCode(): string {
  return crypto.randomBytes(16).toString("hex").toUpperCase();
}
