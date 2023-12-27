import { getAuthSession } from "@/lib/auth-options";
import db from "@/lib/db";
import { posts, reposts } from "@/lib/db/schema";
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

    const repost = await db.query.reposts.findMany({
      where: eq(reposts.repostPostTargetId, postId),
    });
    return new Response(JSON.stringify(repost));
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }
}

// export async function PATCH(req: Request) {
//   try {
//     const session = await getAuthSession();

//     if (!session?.user) {
//       return new Response("Unauthorized", { status: 401 });
//     }

//     const { postId } = await req.json();

//     const reposted = await db
//       .select()
//       .from(reposts)
//       .where(
//         and(
//           eq(reposts.userOriginId, session.user.id),
//           eq(reposts.repostPostTargetId, postId)
//         )
//       );

//     if (reposted.length > 0) {
//       await db
//         .delete(reposts)
//         .where(
//           and(
//             eq(reposts.userOriginId, session.user.id),
//             eq(reposts.repostPostTargetId, postId)
//           )
//         );
//       return new Response("Repost deleted", { status: 200 });
//     }

//     await db
//       .insert(reposts)
//       .values({ userOriginId: session.user.id, repostPostTargetId: postId });

//     return new Response("Liked successfully", { status: 200 });
//   } catch (error) {
//     return new Response("Failed to repost", { status: 500 });
//   }
// }

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { postId } = await req.json();

    const postTarget = await db.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, postId),
    });

    if (!postTarget) {
      return new Response("Post target is not available", { status: 401 });
    }

    //==============================

    const reposted = await db
      .select()
      .from(reposts)
      .where(
        and(
          eq(reposts.userOriginId, session.user.id),
          eq(reposts.repostPostTargetId, postId)
        )
      );

    if (reposted.length > 0) {
      await db
        .delete(posts)
        .where(
          and(eq(posts.postType, "REPOST"), eq(posts.originalPostId, postId))
        );

      await db
        .delete(reposts)
        .where(
          and(
            eq(reposts.userOriginId, session.user.id),
            eq(reposts.repostPostTargetId, postId)
          )
        );

      return new Response("Repost deleted", { status: 200 });
    }

    // Copying original post
    await db
      .insert(posts)
      .values({
        userId: session.user.id,
        content: postTarget.content,
        postType: "REPOST",
        deleted: postTarget.deleted,
        imageUrl: postTarget.imageUrl,
        originalPostId: postId,
      })
      .returning({ insertedId: posts.id });

    await db
      .insert(reposts)
      .values({ userOriginId: session.user.id, repostPostTargetId: postId });

    return new Response("Liked successfully", { status: 200 });
  } catch (error) {
    return new Response("Failed to repost", { status: 500 });
  }
}
