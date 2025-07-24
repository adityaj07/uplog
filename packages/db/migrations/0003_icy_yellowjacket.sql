ALTER TABLE "uplog_changelog" ALTER COLUMN "content" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "uplog_changelog" ALTER COLUMN "content" SET NOT NULL;