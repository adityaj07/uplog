import type { HonoContext } from "@/ctx";
import { StatusCodes } from "@uplog/types/common/index";
import type { MiddlewareHandler } from "hono";

export const authGuard: MiddlewareHandler<HonoContext> = async (c, next) => {
  if (!c.get("sessionUser")) {
    return c.json(
      { error: StatusCodes.UNAUTHORIZED.label },
      StatusCodes.UNAUTHORIZED.code
    );
  }
  console.log("authGuard passing →", c.req.path);
  return next();
};
