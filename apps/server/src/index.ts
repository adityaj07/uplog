import { Hono } from "hono";
import { cors } from "hono/cors";
import type { HonoContext } from "./ctx";

import { auth } from "@uplog/auth/auth";
import { StatusCodes } from "@uplog/types/common/index";
import { randomUUID } from "crypto";
import indexRouter from "./routers";
import { logger } from "hono/logger";
import { env } from "./lib/env";

const app = new Hono<HonoContext>();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN || "",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("*", async (c, next) => {
  const reqId = randomUUID();
  console.log(`[${reqId}] Incoming request: ${c.req.method} ${c.req.url}`);

  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    c.set("auth", auth);
    c.set("sessionUser", session?.user ?? undefined);
  } catch (err) {
    console.error(`[${reqId}] ❌ getSession error:`, err);
    c.set("sessionUser", undefined);
  }

  const res = await next(); // ⬅ wait for downstream
  console.log(`[${reqId}] Response sent.`);
  return res; // ⬅ **return it**
});

app.use("/api/auth/**", async (c) => {
  try {
    console.log("Auth request:", c.req.url);
    return (await auth.handler(c.req.raw)) as Response;
  } catch (error) {
    console.error("Auth error:", error);
    return c.json(
      { error: "Auth failed", message: (error as Error).message },
      StatusCodes.INTERNAL_SERVER_ERROR.code
    );
  }
});

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.route("/api/v1", indexRouter);

app.notFound((c) => {
  return c.text("Route not found", StatusCodes.NOT_FOUND.code);
});

app.onError((err, c) => {
  console.error("Global error handler:", err);
  return c.json(
    { error: "Internal error", message: err.message },
    StatusCodes.INTERNAL_SERVER_ERROR.code
  );
});

export default app;
