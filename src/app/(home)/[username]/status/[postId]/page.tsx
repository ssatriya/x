import SinglePost from "@/components/main/layout/center/post/single-post";
import { getAuthSession } from "@/lib/auth-options";
import db from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { sql, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

type PostPageProps = {
  params: {
    username: string;
    postId: string;
  };
};
export default async function PostPage({ params }: PostPageProps) {
  const session = await getAuthSession();

  if (!session?.user) {
    return redirect("/");
  }

  const userData = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, `@${params.username}`),
  });

  if (!userData) {
    return redirect("/home");
  }

  const singlePost = await db.query.posts.findFirst({
    with: {
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
    where: (posts, { eq, and }) =>
      and(eq(posts.id, params.postId), eq(posts.userId, userData.id)),
  });

  // const singlePost = await db.query.posts.findMany({
  //   where: (posts, { eq, and }) =>
  //     and(eq(posts.id, params.postId), eq(posts.userId, userData.id)),
  //   with: {
  //     originalPost: {
  //       with: {
  //         users: true,
  //         likes: true,
  //         replys: true,
  //         reposts: true,
  //         quoted: true,
  //       },
  //     },
  //     likes: true,
  //     users: true,
  //     reposts: true,
  //     replys: {
  //       with: {
  //         repliedPost: {
  //           with: {
  //             users: true,
  //           },
  //         },
  //       },
  //     },
  //     quoted: {
  //       with: {
  //         post: {
  //           with: {
  //             users: true,
  //           },
  //         },
  //       },
  //     },
  //   },
  // });

  if (!singlePost) {
    return redirect("/home");
  }

  // console.log(singlePost);

  // await db
  //   .update(posts)
  //   .set({ view: sql`${posts.view} + 1` })
  //   .where(eq(posts.id, singlePost.id));

  return (
    // <div>hello</div>
    <SinglePost
      singlePost={singlePost}
      sessionId={session.user.id}
      sessionImage={session.user.image!}
    />
  );
}
