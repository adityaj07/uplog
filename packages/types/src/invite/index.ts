import {
  AcceptEmailInviteSchema,
  AcceptInviteSchema,
  ConsumeInviteCodeSchema,
  CreateInviteInputSchema,
  GenerateInviteCodeSchema,
  InviteTokenPayloadSchema,
  ListInvitesQuerySchema,
  RevokeInviteSchema,
  RoleEnum,
  SendEmailInviteSchema,
  ValidateInviteQuerySchema,
} from "@uplog/schemas";
import z from "zod";

export type Role = z.infer<typeof RoleEnum>;
export type GenerateInviteCodeInput = z.infer<typeof GenerateInviteCodeSchema>;
export type ConsumeInviteCodeInput = z.infer<typeof ConsumeInviteCodeSchema>;
export type SendEmailInviteInput = z.infer<typeof SendEmailInviteSchema>;
export type AcceptEmailInviteInput = z.infer<typeof AcceptEmailInviteSchema>;
export type InviteTokenPayload = z.infer<typeof InviteTokenPayloadSchema>;
export type CreateInviteInput = z.infer<typeof CreateInviteInputSchema>;
export type ListInvitesQuery = z.infer<typeof ListInvitesQuerySchema>;
export type ValidateInviteQuery = z.infer<typeof ValidateInviteQuerySchema>;
export type AcceptInviteInput = z.infer<typeof AcceptInviteSchema>;
export type RevokeInviteInput = z.infer<typeof RevokeInviteSchema>;
