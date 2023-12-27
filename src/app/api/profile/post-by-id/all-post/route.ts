import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth-options";
import db from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    const { searchParams } = new URL(req.url);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const page = searchParams.get("page")!;
    const limit = searchParams.get("limit")!;
    const userByUsernameId = searchParams.get("userByUsernameId")!;

    // if (parseInt(page) === 1) {
    //   const allPosts = await db.query.posts.findMany({
    //     with: {
    //       originalPost: {
    //         with: {
    //           users: true,
    //           likes: true,
    //           replys: true,
    //           reposts: true,
    //           quoted: true,
    //         },
    //       },
    //       likes: true,
    //       users: true,
    //       reposts: true,
    //       replys: {
    //         with: {
    //           repliedPost: {
    //             with: {
    //               users: true,
    //             },
    //           },
    //         },
    //       },
    //       quoted: {
    //         with: {
    //           post: {
    //             with: {
    //               users: true,
    //             },
    //           },
    //         },
    //       },
    //     },
    //     orderBy: (posts, { desc }) => desc(posts.createdAt),
    //     where: (posts, { eq }) => eq(posts.userId, userByUsernameId),
    //     limit: INFINITE_SCROLLING_PAGINATION_RESULTS,
    //   });

    //   return new Response(JSON.stringify(allPosts));
    // }

    const allPosts = await db.query.posts.findMany({
      where: (posts, { eq }) => eq(posts.userId, userByUsernameId),
      with: {
        originalPost: {
          with: {
            users: true,
            likes: true,
            replys: true,
            reposts: true,
            quoted: true,
          },
        },
        likes: true,
        users: true,
        reposts: true,
        replys: {
          with: {
            repliedPost: {
              with: {
                users: true,
              },
            },
          },
        },
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
    return new Response("Internal server error", { status: 500 });
  }
}
