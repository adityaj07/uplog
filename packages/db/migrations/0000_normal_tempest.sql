CREATE TYPE "public"."changelog_status" AS ENUM('DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('OWNER', 'ADMIN', 'EDITOR', 'VIEWER');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('PENDING', 'JOINED');--> statement-breakpoint
CREATE TABLE "uplog_account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "uplog_session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "uplog_session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "uplog_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "uplog_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "uplog_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "uplog_changelog" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" json,
	"image_url" text,
	"status" "changelog_status" DEFAULT 'DRAFT' NOT NULL,
	"scheduled_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"slug" text NOT NULL,
	"is_public" boolean DEFAULT true,
	"view_count" integer DEFAULT 0,
	"created_by" text,
	"updated_by" text,
	"company_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "unique_changelog_slug" UNIQUE("slug","company_id")
);
--> statement-breakpoint
CREATE TABLE "uplog_company" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"subdomain" text NOT NULL,
	"custom_domain" text,
	"website" text,
	"logo" text,
	"brand_color" text,
	"invite_code" text DEFAULT '',
	"setup_complete" boolean DEFAULT false,
	"public_reactions_enabled" boolean DEFAULT true,
	"custom_css" text,
	"layout_style" text DEFAULT 'default',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "uplog_company_subdomain_unique" UNIQUE("subdomain"),
	CONSTRAINT "uplog_company_custom_domain_unique" UNIQUE("custom_domain")
);
--> statement-breakpoint
CREATE TABLE "uplog_changelog_contributor" (
	"id" text PRIMARY KEY NOT NULL,
	"changelog_id" text NOT NULL,
	"contributor_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "unique_changelog_contributor" UNIQUE("changelog_id","contributor_id")
);
--> statement-breakpoint
CREATE TABLE "uplog_contributor" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"avatar_url" text,
	"company_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "uplog_company_member" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"company_id" text NOT NULL,
	"role" "role" NOT NULL,
	"status" "status" DEFAULT 'PENDING',
	"invited_by" text,
	"invited_at" timestamp with time zone,
	"joined_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "unique_company_member" UNIQUE("user_id","company_id")
);
--> statement-breakpoint
CREATE TABLE "uplog_reaction" (
	"id" text PRIMARY KEY NOT NULL,
	"emoji" text NOT NULL,
	"changelog_id" text NOT NULL,
	"anonymous_id" text NOT NULL,
	"ip_address" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "unique_reaction" UNIQUE("changelog_id","emoji","anonymous_id")
);
--> statement-breakpoint
CREATE TABLE "uplog_reaction_config" (
	"id" text PRIMARY KEY NOT NULL,
	"emoji" text NOT NULL,
	"label" text,
	"company_id" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"is_enabled" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "unique_reaction_emoji" UNIQUE("company_id","emoji")
);
--> statement-breakpoint
CREATE TABLE "uplog_changelog_tag" (
	"id" text PRIMARY KEY NOT NULL,
	"changelog_id" text NOT NULL,
	"tag_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "unique_changelog_tag" UNIQUE("changelog_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "uplog_tag" (
	"id" text PRIMARY KEY NOT NULL,
	"tag_name" text NOT NULL,
	"tag_slug" text NOT NULL,
	"tag_emoji" text,
	"tag_color" text,
	"is_default" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"company_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "unique_tag_slug" UNIQUE("tag_slug","company_id")
);
--> statement-breakpoint
ALTER TABLE "uplog_account" ADD CONSTRAINT "uplog_account_user_id_uplog_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."uplog_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uplog_session" ADD CONSTRAINT "uplog_session_user_id_uplog_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."uplog_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uplog_changelog" ADD CONSTRAINT "uplog_changelog_created_by_uplog_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."uplog_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uplog_changelog" ADD CONSTRAINT "uplog_changelog_updated_by_uplog_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."uplog_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uplog_changelog" ADD CONSTRAINT "uplog_changelog_company_id_uplog_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."uplog_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uplog_changelog" ADD CONSTRAINT "uplog_changelog_user_id_uplog_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."uplog_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uplog_changelog_contributor" ADD CONSTRAINT "uplog_changelog_contributor_changelog_id_uplog_changelog_id_fk" FOREIGN KEY ("changelog_id") REFERENCES "public"."uplog_changelog"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uplog_changelog_contributor" ADD CONSTRAINT "uplog_changelog_contributor_contributor_id_uplog_contributor_id_fk" FOREIGN KEY ("contributor_id") REFERENCES "public"."uplog_contributor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uplog_contributor" ADD CONSTRAINT "uplog_contributor_company_id_uplog_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."uplog_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uplog_company_member" ADD CONSTRAINT "uplog_company_member_user_id_uplog_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."uplog_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uplog_company_member" ADD CONSTRAINT "uplog_company_member_company_id_uplog_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."uplog_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uplog_company_member" ADD CONSTRAINT "uplog_company_member_invited_by_uplog_user_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."uplog_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uplog_reaction" ADD CONSTRAINT "uplog_reaction_changelog_id_uplog_changelog_id_fk" FOREIGN KEY ("changelog_id") REFERENCES "public"."uplog_changelog"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uplog_reaction_config" ADD CONSTRAINT "uplog_reaction_config_company_id_uplog_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."uplog_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uplog_changelog_tag" ADD CONSTRAINT "uplog_changelog_tag_changelog_id_uplog_changelog_id_fk" FOREIGN KEY ("changelog_id") REFERENCES "public"."uplog_changelog"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uplog_changelog_tag" ADD CONSTRAINT "uplog_changelog_tag_tag_id_uplog_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."uplog_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uplog_tag" ADD CONSTRAINT "uplog_tag_company_id_uplog_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."uplog_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "uplog_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "changelog_company_id_idx" ON "uplog_changelog" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "changelog_slug_company_idx" ON "uplog_changelog" USING btree ("slug","company_id");--> statement-breakpoint
CREATE INDEX "changelog_status_idx" ON "uplog_changelog" USING btree ("status");--> statement-breakpoint
CREATE INDEX "changelog_published_at_idx" ON "uplog_changelog" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "company_subdomain_idx" ON "uplog_company" USING btree ("subdomain");--> statement-breakpoint
CREATE INDEX "contributor_company_id_idx" ON "uplog_contributor" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "company_member_user_id_idx" ON "uplog_company_member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "company_member_company_id_idx" ON "uplog_company_member" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "reaction_changelog_id_idx" ON "uplog_reaction" USING btree ("changelog_id");--> statement-breakpoint
CREATE INDEX "reaction_config_company_id_idx" ON "uplog_reaction_config" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "tag_company_id_idx" ON "uplog_tag" USING btree ("company_id");