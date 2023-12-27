import { getAuthSession } from "@/lib/auth-options";
import db from "@/lib/db";
import { follows } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { loggedInUserId, userToFollow } = body;

    const isFollowed = await db.query.follows.findFirst({
      where: (follows, { eq, and }) =>
        and(
          eq(follows.followerId, userToFollow),
          eq(follows.followingId, session.user.id)
        ),
    });

    if (!isFollowed) {
      await db
        .insert(follows)
        .values({ followingId: session.user.id, followerId: userToFollow });

      return new Response("Followed successfully", { status: 201 });
    }
    await db
      .delete(follows)
      .where(
        and(
          eq(follows.followerId, userToFollow),
          eq(follows.followingId, session.user.id)
        )
      );

    return new Response("Unfollowed successfully", { status: 201 });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    const { searchParams } = new URL(req.url);

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userByUsernameId = searchParams.get("userByUsernameId");

    if (!userByUsernameId) {
      return new Response("Following ID is missing", { status: 400 });
    }

    // Using Users table to get separate object of Followers and Followings
    // If using the Follows table, it does not have separation between two of them
    const userProfile = await db.query.users.findFirst({
      with: {
        followers: true,
        followings: true,
      },
      where: (users, { eq }) => eq(users.id, userByUsernameId),
    });

    return new Response(JSON.stringify(userProfile));
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }
}
