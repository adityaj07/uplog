import { env } from "cloudflare:workers";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { HonoContext } from "./ctx";
import { auth } from "./lib/auth";
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

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

app.on(["POST", "GET"], "/api/auth/**", async (c) => {
  try {
    console.log("Auth request:", c.req.url);
    return await auth.handler(c.req.raw);
  } catch (error) {
    console.error("Auth error:", error);
    return c.json({ error: "Auth failed" }, 500);
  }
});

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    environment: env.CORS_ORIGIN,
    user: c.get("user"),
    session: c.get("session"),
    timestamp: new Date().toISOString(),
  });
});

app.route("/api/v1", indexRouter);

export default app;
