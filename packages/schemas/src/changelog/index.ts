import z from "zod";

export const ChangelogStatusEnum = z.enum(
  ["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"],
  {
    errorMap: () => ({
      message:
        "Status must be one of: DRAFT, PUBLISHED, SCHEDULED, or ARCHIVED",
    }),
  }
);

export const ChangelogContentSchema = z.record(
  z.any({ required_error: "Content is required" }),
  { required_error: "Content is required" }
);

export const CreateChangelogInputSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, "Title cannot be empty")
    .max(255, "Title is too long"),

  content: ChangelogContentSchema,

  imageUrl: z
    .string()
    .trim()
    .url("Image URL must be a valid URL")
    .optional()
    .or(z.literal("")),

  status: ChangelogStatusEnum.optional(),

  scheduledAt: z
    .string()
    .datetime("Scheduled time must be a valid ISO timestamp")
    .optional(),

  isPublic: z
    .boolean({ invalid_type_error: "isPublic must be a boolean" })
    .optional()
    .default(true),

  tags: z.array(z.string()).optional(),
});

export const UpdateChangelogInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(255, "Title is too long")
    .optional(),

  content: ChangelogContentSchema.optional(),

  imageUrl: z
    .string()
    .trim()
    .url("Image URL must be a valid URL")
    .optional()
    .or(z.literal("")),

  status: ChangelogStatusEnum.optional(),

  scheduledAt: z
    .string()
    .datetime("Scheduled time must be a valid ISO timestamp")
    .optional()
    .nullable(),

  publishedAt: z
    .string()
    .datetime("Published time must be a valid ISO timestamp")
    .optional()
    .nullable(),

  isPublic: z
    .boolean({ invalid_type_error: "isPublic must be a boolean" })
    .optional(),

  tags: z.array(z.string()).optional(),
});

export const ChangeChangelogStatusSchema = z.object({
  status: ChangelogStatusEnum,
});

export const ListChangelogQuerySchema = z.object({
  companyId: z
    .string({ required_error: "Company ID is required" })
    .trim()
    .min(1, "Company ID cannot be empty"),

  status: ChangelogStatusEnum.optional(),

  search: z
    .string({ invalid_type_error: "Search must be a string" })
    .trim()
    .optional(),

  page: z.coerce.number().min(1).max(1000).optional().default(1),
  limit: z.coerce.number().min(1).max(50).optional().default(10),
});

export const PublishToggleSchema = z.object({
  isPublished: z.boolean({
    required_error: "isPublished is required",
    invalid_type_error: "isPublished must be a boolean",
  }),
});
