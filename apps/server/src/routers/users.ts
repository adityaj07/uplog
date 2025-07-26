import { getMe } from "@/controllers/user";
import { guard } from "@/guards";
import type { EnrichedContext } from "@/guards/types";
import { Hono } from "hono";

const usersRouter = new Hono<EnrichedContext>();

usersRouter.get(
  "/me",
  guard({
    authRequired: true,
    minRole: "VIEWER",
  }),
  getMe
);

export default usersRouter;
