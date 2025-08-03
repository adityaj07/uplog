import z from "zod";

export const ListTagsParamSchema = z.object({
  companyId: z.string().min(1),
});

export const CreateTagSchema = z.object({
  tagName: z
    .string()
    .min(1, "Tag name is required")
    .max(50, "Tag name must be at most 50 characters"),

  tagEmoji: z
    .string()
    .max(10, "Tag emoji must be a valid short emoji string")
    .optional(),

  tagColor: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      "Tag color must be a valid hex color (e.g., #FF5733)"
    )
    .optional(),

  sortOrder: z
    .number()
    .int("Sort order must be an integer")
    .min(0, "Sort order cannot be negative")
    .optional(),

  isDefault: z.boolean().optional(),
});

export const UpdateTagSchema = z.object({
  tagName: z
    .string()
    .min(1, "Tag name cannot be empty")
    .max(50, "Tag name must be at most 50 characters")
    .optional(),

  tagEmoji: z
    .string()
    .max(10, "Tag emoji must be a valid short emoji string")
    .optional(),

  tagColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Tag color must be a valid hex color")
    .optional(),

  sortOrder: z
    .number()
    .int("Sort order must be an integer")
    .min(0, "Sort order cannot be negative")
    .optional(),

  isDefault: z.boolean().optional(),
});

export const TagIdParamSchema = z.object({
  tagId: z
    .string()
    .min(1, "Tag ID is required")
    .max(100, "Tag ID seems too long"),
});

export const TagCompanyParamSchema = z.object({
  companyId: z
    .string()
    .min(1, "Company ID is required")
    .max(100, "Company ID seems too long"),
});

export const CreateTagParamSchema = TagCompanyParamSchema;
export const UpdateTagParamSchema =
  TagCompanyParamSchema.merge(TagIdParamSchema);
export const DeleteTagParamSchema = z.object({
  companyId: z
    .string()
    .min(1, "Company ID is required")
    .max(100, "Company ID seems too long"),

  tagId: z
    .string()
    .min(1, "Tag ID is required")
    .max(100, "Tag ID seems too long"),
});
