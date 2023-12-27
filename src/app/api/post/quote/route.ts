import { getAuthSession } from "@/lib/auth-options";
import db from "@/lib/db";
import { posts, quotes } from "@/lib/db/schema";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { postTargetId, content, imageUrl } = await req.json();

    if (!postTargetId || !content) {
      return new Response("Post ID or content is missing", { status: 400 });
    }

    const post = await db
      .insert(posts)
      .values({
        userId: session.user.id,
        postType: "QUOTE",
        content: content,
        imageUrl: imageUrl,
      })
      .returning({ insertedId: posts.id });

    if (post[0].insertedId) {
      const quote = await db
        .insert(quotes)
        .values({
          quoteOriginId: post[0].insertedId,
          quoteTargetId: postTargetId,
          userOriginId: session.user.id,
        })
        .returning({ insertedId: quotes.id });

      if (quote[0].insertedId) {
        return new Response("Quoted successfully", { status: 201 });
      }
    }
  } catch (error) {
    return new Response("Failed to quote", { status: 500 });
  }
}
