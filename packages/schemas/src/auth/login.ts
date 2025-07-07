import z from "zod";

export const userLoginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email is required")
    .refine(
      (identifier) =>
        z.string().email().safeParse(identifier).success ||
        identifier.length > 3,
      "Invalid email."
    ),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
