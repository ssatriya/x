"use client";

import * as React from "react";

import { Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import {
  ExtendedPost,
  ExtendedReplyContent,
  SelectUser,
} from "@/lib/db/schema";
import ReplyItem from "./reply-item";

type TestReplyProps = {
  post: ExtendedPost;
  sessionId: string;
  sessionImage: SelectUser["image"];
};

const TestReply = ({ post, sessionId, sessionImage }: TestReplyProps) => {
  const queryClient = useQueryClient();

  const { data: TestReply, isLoading } = useQuery({
    queryKey: ["TestReply"],
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
      queryClient.resetQueries({ queryKey: ["TestReply"], exact: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {TestReply &&
        TestReply.map((reply) => (
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
export default TestReply;
