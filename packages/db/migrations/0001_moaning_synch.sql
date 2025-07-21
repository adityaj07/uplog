CREATE TYPE "public"."invite_type" AS ENUM('email', 'manual');--> statement-breakpoint
CREATE TABLE "uplog_invite" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"email" text,
	"code" text NOT NULL,
	"role" "role" NOT NULL,
	"type" "invite_type" NOT NULL,
	"max_uses" integer DEFAULT 1 NOT NULL,
	"use_count" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone NOT NULL,
	"revoked" boolean DEFAULT false NOT NULL,
	"invited_by" text,
	"invited_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "uplog_invite_code_unique" UNIQUE("code"),
	CONSTRAINT "unique_invite_code" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "uplog_invite" ADD CONSTRAINT "uplog_invite_company_id_uplog_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."uplog_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uplog_invite" ADD CONSTRAINT "uplog_invite_invited_by_uplog_user_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."uplog_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "invite_company_id_idx" ON "uplog_invite" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "invite_email_company_idx" ON "uplog_invite" USING btree ("email","company_id");