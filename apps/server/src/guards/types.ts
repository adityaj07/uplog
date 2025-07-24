import type { HonoContext } from "@/ctx";
import type { Role } from "@uplog/types/invite";

export interface GuardConfig {
  authRequired?: boolean;
  isOnboarded?: boolean;
  hasPayment?: boolean;
  minRole?: Role;
  canInvite?: boolean;
  // Add more permission flags as needed
}

export interface GuardError {
  code: number;
  message: string;
  label: string;
  internal?: string; // For logging
}

export interface GuardResult {
  success: boolean;
  error?: GuardError;
}

// Extend HonoContext with enriched data
export interface EnrichedContext extends HonoContext {
  Variables: HonoContext["Variables"] & {
    requestId: string;
    company?: {
      id: string;
      name: string;
      subdomain: string;
      setupComplete: boolean;
    };
    companyMember?: {
      id: string;
      role: Role;
      status: "PENDING" | "JOINED";
      userId: string;
      companyId: string;
    };
    subscription?: {
      plan: string;
      active: boolean;
    };
  };
}
