import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { HonoContext } from "./ctx";
import { auth } from "./lib/auth";
import { indexRouter } from "./routers";
import { env } from "cloudflare:workers";

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

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.get("/", (c) => {
  return c.text("OK");
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
