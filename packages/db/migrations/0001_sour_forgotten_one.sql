CREATE TYPE "public"."onboarding_status" AS ENUM('PENDING', 'PROFILE_COMPLETED', 'COMPANY_CREATED', 'COMPLETED');--> statement-breakpoint
ALTER TABLE "uplog_user" ALTER COLUMN "email_verified" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "uplog_user" ADD COLUMN "onboardingStatus" "onboarding_status" DEFAULT 'PENDING' NOT NULL;