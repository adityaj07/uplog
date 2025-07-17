import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
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

export type user = {
  id: string;
  name: string;
  emailVerified: boolean;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null | undefined | undefined;
  onboardingStatus: string[];
} | null;

export type session = {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string | null | undefined | undefined;
  userAgent?: string | null | undefined | undefined;
} | null;
