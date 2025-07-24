import type { Auth } from "@uplog/auth/auth";
import { type Company, type CompanyMember } from "@uplog/db/types";
import type { env } from "cloudflare:workers";

// derive the exact User type from your auth lib
export type SessionUser = NonNullable<
  Awaited<ReturnType<Auth["api"]["getSession"]>>
>["user"];

export type HonoVariables = {
  auth: Auth; // handy for handlers/tests
  sessionUser?: SessionUser;
  requestId?: string;
  company?: Company;
  companyMember?: CompanyMember;
};

export type HonoContext = { Variables: HonoVariables; Bindings: typeof env };
