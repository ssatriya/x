import { getAuthSession } from "@/lib/auth-options";
import db from "@/lib/db";
import { replys } from "@/lib/db/schema";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return new Response("Post ID is missing", { status: 400 });
    }

    const replyData = await db.query.replys.findMany({
      with: {
        repliedPost: {
          with: {
            users: true,
          },
        },
        replys: {
          with: {
            users: true,
            // additional
            likes: true,
            reposts: true,
            replys: true,
            quoted: {
              with: {
                post: {
                  with: {
                    users: true,
                  },
                },
              },
            },
          },
        },
      },
      where: (replys, { eq }) => eq(replys.replyTargetId, postId),
      orderBy: (replys, { desc }) => desc(replys.createdAt),
    });

    return new Response(JSON.stringify(replyData));
  } catch (error) {
    return new Response("Failed to fetch reply data", { status: 500 });
  }
}
