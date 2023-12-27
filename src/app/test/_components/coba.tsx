"use client";

import { ExtendedPost, ReplyWithRepliedTo } from "@/lib/db/schema";
import { useQueries } from "@tanstack/react-query";
import axios from "axios";
import { InferSelectModel } from "drizzle-orm";

const Coba = ({ post, relRep }: { post: any[]; relRep: string[] }) => {
  // console.log(relRep);

  const userQueries = useQueries({
    queries: relRep.map((rep) => {
      return {
        queryKey: ["user", rep],
        queryFn: async () => {
          const { data } = await axios.get("/api/post/reply/related-reply", {
            params: {
              postId: rep,
            },
          });
          return data;
        },
      };
    }),
  });

  // console.log(userQueries);

  return <div>Coba</div>;
};
export default Coba;
