import db from "@/lib/db";
import { getAuthSession } from "@/lib/auth-options";
import { posts } from "@/lib/db/schema";

// export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    const { content, imageUrl } = await req.json();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    await db.insert(posts).values({
      content: content,
      imageUrl: imageUrl,
      postType: "POST",
      userId: session.user.id,
    });

    return new Response("Post submitted successfully", { status: 200 });
  } catch (error) {
    return new Response("Internal error", {
      status: 500,
    });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    const { searchParams } = new URL(req.url);

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const page = searchParams.get("page")!;
    const limit = searchParams.get("limit")!;

    const allPosts = await db.query.posts.findMany({
      where: (posts, { or, eq }) =>
        or(
          eq(posts.postType, "POST"),
          eq(posts.postType, "QUOTE"),
          eq(posts.postType, "REPLY")
        ),
      with: {
        likes: true,
        users: true,
        reposts: true,
        repliedPost: true,
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
      orderBy: (posts, { desc }) => desc(posts.createdAt),
      offset: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
    });

    return new Response(JSON.stringify(allPosts));
  } catch (error) {
    return new Response("Could not fetch posts", {
      status: 500,
    });
  }
}
