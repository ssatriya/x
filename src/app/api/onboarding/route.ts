import { z } from "zod";
import { parse, format } from "date-fns";

import { getAuthSession } from "@/lib/auth-options";
import { OnboardingValidator } from "@/lib/validator/onboarding";
import db from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, ne } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { birthdate, bio, username } = OnboardingValidator.parse(body);

    const isUsernameExist = await db
      .select()
      .from(users)
      .where(ne(users.id, session.user.id));

    const filterUsername = isUsernameExist.filter(
      (user) => user.username === username.toLowerCase()
    );

    if (filterUsername.length > 0) {
      return new Response("Username already exist.", { status: 409 });
    }

    const parsedBirthdate = parse(birthdate, "yyyy-MM-dd", new Date());
    const formattedBirthdate = format(parsedBirthdate, "yyyy-MM-dd");

    await db
      .update(users)
      .set({
        birthdate: formattedBirthdate,
        bio,
        username: `@${username}`,
        onboarding: true,
      })
      .where(eq(users.id, session.user.id));

    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 402 });
    }

    return new Response("Failed to submit onboarding data.", { status: 500 });
  }
}
