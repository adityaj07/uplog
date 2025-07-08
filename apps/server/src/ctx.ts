import type { env } from "cloudflare:workers";

// export type SessionUser = NonNullable<Awaited<ReturnType<Auth['api']['getSession']>>>['user'];

// export type HonoVariables = {
//   auth: Auth;
//   sessionUser?: SessionUser;
//   autumn: Autumn;
// };

export type HonoContext = { Bindings: typeof env };
