DO $$ BEGIN
 ALTER TABLE "follow" ADD CONSTRAINT "follow_followerId_user_id_fk" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follow" ADD CONSTRAINT "follow_followingId_user_id_fk" FOREIGN KEY ("followingId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
