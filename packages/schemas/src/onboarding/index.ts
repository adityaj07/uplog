import { z } from "zod";

export const onboardingCompanySchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name must be at most 50 characters long"),
  logo: z.string().url("Invalid URL format").or(z.literal("")).optional(),
  website: z.string().url("Invalid URL format").or(z.literal("")).optional(),
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters long")
    .max(50, "Subdomain must be at most 50 characters long")
    .regex(
      /^[a-z0-9-]+$/,
      "Subdomain can only contain lowercase letters, numbers, and hyphens"
    ),
  changelogpageLayout: z.enum(["default", "compact", "spacious"]),
  brandColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, {
    message:
      "Invalid color format. Must be a 7-character hex code (e.g., #RRGGBB).",
  }),
});

export const onboardingUserSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name must be at most 50 characters long"),
  jobTitle: z
    .string()
    .min(3, "Job title must be at least 3 characters long")
    .max(50, "Job title must be at most 50 characters long")
    .regex(/[a-zA-Z]/, "Job title must contain at least one letter"),
  image: z.string().url("Invalid URL format").or(z.literal("")).optional(),
});
