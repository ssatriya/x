import { z } from "zod";

import db from "@/lib/db";
import { removeAtSymbol } from "@/lib/utils";
import { getAuthSession } from "@/lib/auth-options";
import { UsernameValidator } from "@/lib/validator/username";
import { users } from "@/lib/db/schema";
import { ne } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const usernameParams = searchParams.get("username");
    const userId = searchParams.get("userId");

    if (!usernameParams) {
      return new Response("Username is missing.", { status: 401 });
    }

    const cleanUsername = removeAtSymbol(usernameParams);
    const username = UsernameValidator.parse(cleanUsername);

    if (!userId) {
      return new Response("Unauthorized.", { status: 401 });
    }

    const user = await db.select().from(users).where(ne(users.id, userId));

    if (user.length === 0) {
      return new Response("Username is available.", { status: 200 });
    }

    const filterUsername = user.filter(
      (u) => u.username === username.toLowerCase()
    );

    if (filterUsername.length !== 0) {
      return new Response("Username is already exist.", { status: 409 });
    } else {
      return new Response("Username is available.", { status: 200 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 402 });
    }

    return new Response("Failed to check username.", { status: 500 });
  }
}
