ALTER TABLE "follow" DROP CONSTRAINT "follow_followingId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "follow" DROP COLUMN IF EXISTS "followingId";