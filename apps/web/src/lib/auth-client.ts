import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});

export const googleSignIn = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: `${process.env.NEXT_PUBLIC_FE_URL}/dashboard`,
    errorCallbackURL: `${process.env.NEXT_PUBLIC_FE_URL}/auth`,
    newUserCallbackURL: `${process.env.NEXT_PUBLIC_FE_URL}/onboarding`,
  });
};
