import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { Auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  plugins: [inferAdditionalFields<Auth>()],
  fetchOptions: {
    credentials: "include",
  },
});

export const googleSignIn = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: `${process.env.NEXT_PUBLIC_FE_URL}/dashboard`,
    errorCallbackURL: `${process.env.NEXT_PUBLIC_FE_URL}/auth`,
    newUserCallbackURL: `${process.env.NEXT_PUBLIC_FE_URL}/onboarding`,
  });
};

export type user = typeof authClient.$Infer.Session.user | null;
export type session = typeof authClient.$Infer.Session.session | null;
