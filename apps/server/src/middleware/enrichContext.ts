import type { HonoContext } from "@/ctx";
import { getDatabase } from "@/db";

import { getCompanyDetails } from "@/repositories/company";
import {
  getUserCompanyId,
  getUserCompanyMembership,
} from "@/repositories/invite";
import type { Company, CompanyMember } from "@uplog/db/types";
import { randomUUID } from "crypto";
import type { MiddlewareHandler } from "hono";

export interface EnrichedVariables {
  requestId: string;
  company?: Company;
  companyMember?: CompanyMember;
}

export const enrichContext: MiddlewareHandler<HonoContext> = async (
  c,
  next
) => {
  const reqId = c.get("requestId") || randomUUID();
  c.set("requestId", reqId);

  const sessionUser = c.get("sessionUser");

  if (!sessionUser) {
    console.log(`[${reqId}] No session user - skipping enrichment`);
    return next();
  }

  try {
    console.log(`[${reqId}] Enriching context for user: ${sessionUser.id}`);

    const db = getDatabase();

    // Get user's company ID first
    const companyId = await getUserCompanyId(db, sessionUser.id);

    if (companyId) {
      // Get full membership details
      const membership = await getUserCompanyMembership(
        db,
        sessionUser.id,
        companyId
      );
      const company = await getCompanyDetails(db, companyId);

      if (company && membership) {
        c.set("company", company);
        c.set("companyMember", membership);

        console.log(
          `[${reqId}] Context enriched - Company: ${company.name}, Role: ${membership.role}`
        );
      }
    } else {
      console.log(
        `[${reqId}] No company membership found for user: ${sessionUser.id}`
      );
    }
  } catch (error) {
    console.error(`[${reqId}] Failed to enrich context:`, error);
    // Don't fail the request, just log the error
  }

  return next();
};
