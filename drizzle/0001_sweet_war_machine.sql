CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"clerk_id" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "brand_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "location" text NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "created_by" text NOT NULL;