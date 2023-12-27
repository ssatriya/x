DO $$ BEGIN
 CREATE TYPE "postType" AS ENUM('POST', 'REPOST', 'REPLY', 'QUOTE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"userId" uuid DEFAULT "USING "userId"::uuid" NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "like" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userOriginId" uuid NOT NULL,
	"likePostTargetId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid DEFAULT "USING "userId"::uuid" NOT NULL,
	"content" text,
	"imageUrl" text,
	"postType" "postType" NOT NULL,
	"replys" integer DEFAULT 0 NOT NULL,
	"repostQuoteAmount" integer DEFAULT 0 NOT NULL,
	"likeAmount" integer DEFAULT 0 NOT NULL,
	"deleted" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quote" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quoteOriginId" uuid NOT NULL,
	"quoteTargetId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reply" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"replyOriginId" uuid NOT NULL,
	"replyTargetId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "repost" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userOriginId" uuid NOT NULL,
	"repostPostTargetId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" uuid DEFAULT "USING "userId"::uuid" NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"username" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"bio" varchar(255),
	"birthdate" varchar(20),
	"onboarding" boolean DEFAULT false,
	"backgroundPhoto" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "like" ADD CONSTRAINT "like_userOriginId_user_id_fk" FOREIGN KEY ("userOriginId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "like" ADD CONSTRAINT "like_likePostTargetId_post_id_fk" FOREIGN KEY ("likePostTargetId") REFERENCES "post"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quote" ADD CONSTRAINT "quote_quoteOriginId_post_id_fk" FOREIGN KEY ("quoteOriginId") REFERENCES "post"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quote" ADD CONSTRAINT "quote_quoteTargetId_post_id_fk" FOREIGN KEY ("quoteTargetId") REFERENCES "post"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reply" ADD CONSTRAINT "reply_replyOriginId_post_id_fk" FOREIGN KEY ("replyOriginId") REFERENCES "post"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reply" ADD CONSTRAINT "reply_replyTargetId_post_id_fk" FOREIGN KEY ("replyTargetId") REFERENCES "post"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "repost" ADD CONSTRAINT "repost_userOriginId_user_id_fk" FOREIGN KEY ("userOriginId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "repost" ADD CONSTRAINT "repost_repostPostTargetId_post_id_fk" FOREIGN KEY ("repostPostTargetId") REFERENCES "post"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
