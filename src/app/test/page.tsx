import db from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Coba from "./_components/coba";

export default async function TestPage() {
  let postTest;
  postTest = await db.query.posts.findMany({
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
  });

  // postTest = await db.query.posts.findMany({
  //   with: {
  //     likes: true,
  //     users: true,
  //     reposts: true,
  //     replys: true,
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
  //   orderBy: (posts, { desc }) => desc(posts.createdAt),
  // });

  return (
    <div>
      {JSON.stringify(postTest)}

      {/* <Coba post={postTest} /> */}
    </div>
  );
}
