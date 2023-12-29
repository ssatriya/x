"use client";

import { SelectUser, UsersProfile } from "@/lib/db/schema";
import { useIntersection } from "@mantine/hooks";
import { Loader2 } from "lucide-react";
import * as React from "react";
import Post from "../../post/post";
import Quote from "../../quote/quote";
import ReplyWithRepliedTo from "../../reply/reply-with-replied-to";
import Repost from "../../repost/repost";
import { useInfiniteQuery } from "@tanstack/react-query";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import axios from "axios";

type AllUserPostProps = {
  userByUsername: UsersProfile;
  sessionId: SelectUser["id"];
  sessionImage: SelectUser["image"];
};

const AllUserPost = ({
  userByUsername,
  sessionId,
  sessionImage,
}: AllUserPostProps) => {
  const lastPostRef = React.useRef();
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 0.7,
  });

  const { data, fetchNextPage, isFetching, isLoading, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["all-user-post"],
      queryFn: async ({ pageParam }) => {
        const query = `/api/profile/post-by-id/all-post?userByUsernameId=${userByUsername.id}&limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}`;

        const { data } = await axios.get(query);
        return data as ReplyWithRepliedTo[];
      },
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialPageParam: 1,
    });

  React.useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetching) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry?.isIntersecting]);

  const allPosts: ReplyWithRepliedTo[] =
    data?.pages.flatMap((page) => page) ?? [];

  return (
    <>
      <ul>
        {isLoading ? (
          <div className="h-full flex justify-center items-start mt-6">
            <Loader2 className="h-9 w-9 animate-spin stroke-blue" />
          </div>
        ) : (
          allPosts?.map((post, index) => {
            if (index === allPosts.length - 1) {
              if (post.postType === "POST") {
                return (
                  <li key={post.id} ref={ref}>
                    <Post
                      post={post}
                      sessionId={sessionId}
                      sessionImage={sessionImage}
                      styles="border-b"
                    />
                  </li>
                );
              } else if (post.postType === "REPOST") {
                return (
                  <li key={post.id} ref={ref}>
                    <Repost
                      post={post.originalPost}
                      sessionId={sessionId}
                      sessionImage={sessionImage}
                    />
                  </li>
                );
              } else if (post.postType === "REPLY") {
                return (
                  <li key={post.id} ref={ref}>
                    <ReplyWithRepliedTo
                      replyPost={post}
                      sessionId={sessionId}
                      sessionImage={sessionImage}
                    />
                  </li>
                );
              } else if (post.postType === "QUOTE") {
                return (
                  <li key={post.id} ref={ref}>
                    <Quote
                      post={post}
                      sessionId={sessionId}
                      sessionImage={sessionImage}
                    />
                  </li>
                );
              }
            } else {
              if (post.postType === "POST") {
                return (
                  <Post
                    key={post.id}
                    post={post}
                    sessionId={sessionId}
                    sessionImage={sessionImage}
                    styles="border-b"
                  />
                );
              } else if (post.postType === "REPOST") {
                return (
                  <Repost
                    key={post.id}
                    post={post.originalPost}
                    sessionId={sessionId}
                    sessionImage={sessionImage}
                  />
                );
              } else if (post.postType === "REPLY") {
                return (
                  <ReplyWithRepliedTo
                    key={post.id}
                    replyPost={post}
                    sessionId={sessionId}
                    sessionImage={sessionImage}
                  />
                );
              } else if (post.postType === "QUOTE") {
                return (
                  <Quote
                    key={post.id}
                    post={post}
                    sessionId={sessionId}
                    sessionImage={sessionImage}
                  />
                );
              }
            }
          })
        )}
      </ul>
      {!isLoading && isFetching && (
        <li className="pb-6 h-full flex justify-center items-start mt-6">
          <Loader2 className="h-9 w-9 animate-spin stroke-blue" />
        </li>
      )}
      {/* {!hasNextPage && !isFetching && !isLoading && (
        <li className="pb-6 h-full flex justify-center items-start mt-6">
          <p>No more posts</p>
        </li>
      )} */}
    </>
  );
};
export default AllUserPost;
