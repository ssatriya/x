import { getAuthSession } from "@/lib/auth-options";
import db from "@/lib/db";
import { posts, replys } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized.", { status: 401 });
    }

    const { postTargetId, content, imageUrl } = await req.json();

    if (!postTargetId || !content) {
      return new Response("Post ID or content is missing", { status: 400 });
    }

    const post = await db
      .insert(posts)
      .values({
        userId: session.user.id,
        postType: "REPLY",
        content: content,
        imageUrl: imageUrl,
      })
      .returning({ insertedId: posts.id });

    if (post[0].insertedId) {
      const reply = await db
        .insert(replys)
        .values({
          replyOriginId: post[0].insertedId,
          replyTargetId: postTargetId,
          userOriginId: session.user.id,
        })
        .returning({ insertedId: replys.id });

      if (reply[0].insertedId) {
        return new Response("Replied successfully", { status: 201 });
      }
    }
  } catch (error) {
    return new Response("Failed to reply", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    const { searchParams } = new URL(req.url);

    if (!session?.user) {
      return new Response("Unauthorized.", { status: 401 });
    }

    const postId = searchParams.get("postId");

    if (!postId) {
      return new Response("Post ID is missing", { status: 400 });
    }

    const replyData = await db
      .select()
      .from(replys)
      .where(eq(replys.replyTargetId, postId));

    return new Response(JSON.stringify(replyData));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
