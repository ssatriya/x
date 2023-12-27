CREATE TABLE IF NOT EXISTS "follows_to_users" (
	"follow_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "follows_to_users_follow_id_user_id_pk" PRIMARY KEY("follow_id","user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follows_to_users" ADD CONSTRAINT "follows_to_users_follow_id_follow_id_fk" FOREIGN KEY ("follow_id") REFERENCES "follow"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follows_to_users" ADD CONSTRAINT "follows_to_users_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
