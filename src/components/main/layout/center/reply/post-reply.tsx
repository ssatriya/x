"use client";

import * as React from "react";

import {
  ExtendedPost,
  ExtendedReplyContent,
  SelectUser,
} from "@/lib/db/schema";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import ReplyItem from "./reply-item";
import { Loader2 } from "lucide-react";

type PostReplyProps = {
  post: ExtendedPost;
  sessionId: string;
  sessionImage: SelectUser["image"];
};

const PostReply = ({ post, sessionId, sessionImage }: PostReplyProps) => {
  const queryClient = useQueryClient();

  const { data: replyData, isLoading } = useQuery({
    queryKey: ["replyData"],
    queryFn: async () => {
      const { data } = await axios.get("/api/post/reply/reply-data", {
        params: {
          postId: post?.id,
        },
      });
      return data as ExtendedReplyContent;
    },
  });

  React.useEffect(() => {
    return () => {
      queryClient.resetQueries({ queryKey: ["replyData"], exact: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {replyData &&
        replyData.map((reply) => (
          <ReplyItem
            key={reply.id}
            sessionId={sessionId}
            replyPost={reply.replys}
            sessionImage={sessionImage}
          />
        ))}

      {isLoading && (
        <div className="my-20 flex items-center justify-center">
          <Loader2 className="animate-spin stroke-blue h-10 w-10" />
        </div>
      )}
    </>
  );
};
export default PostReply;
