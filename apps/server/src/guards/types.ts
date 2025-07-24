import type { HonoContext } from "@/ctx";
import type { Company, CompanyMember } from "@uplog/db/types";
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
    company?: Company;
    companyMember?: CompanyMember;
    subscription?: {
      plan: string;
      active: boolean;
    };
  };
}
