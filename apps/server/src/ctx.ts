import type { env } from "cloudflare:workers";
import type { auth } from "./lib/auth";

export type HonoContext = {
  Bindings: typeof env;
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};
