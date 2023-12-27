ALTER TABLE "quote" ADD COLUMN "userOriginId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "reply" ADD COLUMN "userOriginId" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quote" ADD CONSTRAINT "quote_userOriginId_user_id_fk" FOREIGN KEY ("userOriginId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reply" ADD CONSTRAINT "reply_userOriginId_user_id_fk" FOREIGN KEY ("userOriginId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
