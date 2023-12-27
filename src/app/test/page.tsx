import db from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Coba from "./_components/coba";

export default async function TestPage() {
  let postTest;
  // postTest = await db.query.posts.findMany({
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
  //   orderBy: (posts, { desc }) => desc(posts.createdAt),
  // });

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

  postTest = await db.query.posts.findMany({
    with: {
      replys: true,
      likes: true,
      repliedPost: {
        with: {
          replys: {
            with: {
              users: true,
            },
          },
        },
      },
    },
    where: (posts, { eq }) =>
      eq(posts.id, "5471f974-37ff-497e-ba80-189f290d2af9"),
  });

  const arr: string[] = [];
  const test = postTest[0].repliedPost.map((rep) => {
    arr.push(rep.id);
  });

  return (
    <div>
      {/* {JSON.stringify(postTest)} */}

      <Coba post={postTest} relRep={arr} />
    </div>
  );
}
