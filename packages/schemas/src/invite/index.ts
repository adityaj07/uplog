import { z } from "zod";

export const RoleEnum = z.enum(["OWNER", "ADMIN", "EDITOR", "VIEWER"]);

// when admin generates a one-time invite code.
export const GenerateInviteCodeSchema = z.object({
  companyId: z.string().nanoid(), // Secure UUID for company
  role: RoleEnum,
  expiresAt: z.date().optional(), // Optional expiry for the invite code
});

// when a user enters a code manually to join a company.
export const ConsumeInviteCodeSchema = z.object({
  code: z.string().min(6, "Invalid code").max(32, "Code too long"),
  userId: z.string().nanoid(), // The user trying to join
});

// when admin invites users via email.
export const SendEmailInviteSchema = z.object({
  companyId: z.string().nanoid(),
  email: z.string().email(),
  role: RoleEnum,
});

// when a user clicks a link and accepts the invite.
export const AcceptEmailInviteSchema = z.object({
  token: z.string().min(10, "Invalid token"),
  userId: z.string().nanoid(), // The new user accepting invite
});

// what goes into the email link or code
export const InviteTokenPayloadSchema = z.object({
  inviteId: z.string().nanoid(),
  companyId: z.string().nanoid(),
  email: z.string().email().optional(), // only present for email invites
  role: RoleEnum,
  type: z.enum(["email", "code"]),
  exp: z.number(), // UNIX timestamp expiry
});

export const ListInvitesQuerySchema = z.object({
  page: z.coerce.number().min(1).max(1000).optional().default(1),
  limit: z.coerce.number().min(1).max(50).optional().default(10),
  status: z.enum(["active", "expired", "revoked", "used"]).optional(),
});

export const CreateInviteInputSchema = z.discriminatedUnion("type", [
  SendEmailInviteSchema.extend({ type: z.literal("email") }),
  GenerateInviteCodeSchema.extend({ type: z.literal("manual") }),
]);
