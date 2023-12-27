DROP TABLE "follows_to_users";--> statement-breakpoint
ALTER TABLE "follow" DROP CONSTRAINT "follow_followerId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "follow" ALTER COLUMN "followerId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "follow" ADD COLUMN "followingId" uuid;