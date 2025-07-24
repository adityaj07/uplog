import { StatusCodes } from "@uplog/types/common/index";
import type { MiddlewareHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { checkAuth } from "./checks/checkAuth";
import { checkCanInvite, checkSubscription } from "./checks/checkCanInvite";
import { checkOnboarded } from "./checks/checkOnboarded";
import { checkRole } from "./checks/checkRole";
import type { EnrichedContext, GuardConfig } from "./types";

function validateGuardConfig(config: GuardConfig): void {
  // Validate that dependent checks have their prerequisites
  if (config.minRole && !config.authRequired) {
    throw new Error("minRole requires authRequired to be true");
  }

  if (config.canInvite && !config.authRequired) {
    throw new Error("canInvite requires authRequired to be true");
  }

  if (config.isOnboarded && !config.authRequired) {
    throw new Error("isOnboarded requires authRequired to be true");
  }

  if (config.hasPayment && !config.isOnboarded) {
    throw new Error("hasPayment requires isOnboarded to be true");
  }
}

export function guard(config: GuardConfig): MiddlewareHandler<EnrichedContext> {
  // Validate configuration at middleware creation time
  // try {
  //   validateGuardConfig(config);
  // } catch (error) {
  //   throw error;
  // }

  return async (c, next) => {
    const reqId = c.get("requestId") || "unknown";

    try {
      validateGuardConfig(config);
    } catch (error) {
      console.error(`[${reqId}] Invalid guard config:`, error);
      return c.json(
        { error: `Invalid guard configuration. ${error}` },
        StatusCodes.INTERNAL_SERVER_ERROR.code
      );
    }

    console.log(`[${reqId}] Guard checks starting:`, {
      path: c.req.path,
      method: c.req.method,
      config,
    });

    // Run checks in logical order with early returns

    if (config.authRequired) {
      const authResult = checkAuth(c);
      if (!authResult.success) {
        const { error } = authResult;
        console.log(`[${reqId}] Guard failed - Auth: ${error!.internal}`);
        return c.json(
          { error: error!.message },
          error?.code as ContentfulStatusCode
        );
      }
    }

    if (config.isOnboarded) {
      const onboardResult = checkOnboarded(c);
      if (!onboardResult.success) {
        const { error } = onboardResult;
        console.log(`[${reqId}] Guard failed - Onboarding: ${error!.internal}`);
        return c.json(
          { error: error!.message },
          error?.code as ContentfulStatusCode
        );
      }
    }

    if (config.minRole) {
      const roleResult = checkRole(c, config.minRole);
      if (!roleResult.success) {
        const { error } = roleResult;
        console.log(`[${reqId}] Guard failed - Role: ${error!.internal}`);
        return c.json(
          { error: error!.message },
          error?.code as ContentfulStatusCode
        );
      }
    }

    if (config.canInvite) {
      const inviteResult = checkCanInvite(c);
      if (!inviteResult.success) {
        const { error } = inviteResult;
        console.log(
          `[${reqId}] Guard failed - Invite permission: ${error!.internal}`
        );
        return c.json(
          { error: error!.message },
          error?.code as ContentfulStatusCode
        );
      }
    }

    if (config.hasPayment) {
      const subscriptionResult = checkSubscription(c);
      if (!subscriptionResult.success) {
        const { error } = subscriptionResult;
        console.log(
          `[${reqId}] Guard failed - Subscription: ${error!.internal}`
        );
        return c.json(
          { error: error!.message },
          error?.code as ContentfulStatusCode
        );
      }
    }

    console.log(`[${reqId}] All guard checks passed`);
    return next();
  };
}
