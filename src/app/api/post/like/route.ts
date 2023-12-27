import { getAuthSession } from "@/lib/auth-options";
import db from "@/lib/db";
import { likes } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    const { searchParams } = new URL(req.url);

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const postId = searchParams.get("postId");

    if (!postId) {
      return new Response("Post ID is missing", { status: 400 });
    }

    const likeData = await db
      .select()
      .from(likes)
      .where(eq(likes.likePostTargetId, postId));

    return new Response(JSON.stringify(likeData));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    const { postId } = await req.json();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!postId) {
      return new Response("Post ID or User ID is missing", { status: 400 });
    }

    const liked = await db
      .select()
      .from(likes)
      .where(
        and(
          eq(likes.likePostTargetId, postId),
          eq(likes.userOriginId, session.user.id)
        )
      );

    if (liked.length > 0) {
      await db
        .delete(likes)
        .where(
          and(
            eq(likes.likePostTargetId, postId),
            eq(likes.userOriginId, session.user.id)
          )
        );

      return new Response("Like deleted", { status: 200 });
    }

    await db
      .insert(likes)
      .values({ likePostTargetId: postId, userOriginId: session.user.id });

    return new Response("Liked successfully", { status: 200 });
  } catch (error) {
    return new Response("Failed to like", { status: 500 });
  }
}
