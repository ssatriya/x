import { getAuthSession } from "@/lib/auth-options";
import db from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    // const session = await getAuthSession();

    // if (!session?.user) {
    //   return new Response("Unauthorized", { status: 401 });
    // }
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId")!;

    // console.log(postId);

    const relatedReply = await db.query.posts.findFirst({
      // with: {
      //   replys: true,
      //   likes: true,
      //   repliedPost: true,
      // },
      where: (posts, { eq }) => eq(posts.id, postId),
    });

    return new Response(JSON.stringify(relatedReply));
  } catch (error) {
    return new Response("Internal server error", { status: 401 });
  }
}
