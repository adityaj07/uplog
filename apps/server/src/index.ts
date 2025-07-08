import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { HonoContext } from "./ctx";
import { auth } from "./lib/auth";
import { env } from "./lib/env";
import { indexRouter } from "./routers";

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

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.get("/", (c) => {
  return c.text("OK");
});

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    environment: env.CORS_ORIGIN,
    timestamp: new Date().toISOString(),
  });
});

app.route("/api/v1", indexRouter);

export default app;
