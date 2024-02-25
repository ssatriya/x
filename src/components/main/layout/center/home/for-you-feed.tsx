"use client";

import * as React from "react";
import { useIntersection } from "@mantine/hooks";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";

import Post from "@/components/main/layout/center/post/post";
import { ExtendedPost, SelectUser } from "@/lib/db/schema";
import Quote from "@/components/main/layout/center/quote/quote";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { useScrollHistory } from "@/hooks/useScrollHistory";

type ForYouFeedProps = {
  sessionId: string;
  sessionImage: SelectUser["image"];
  initialPosts: ExtendedPost[];
};
const ForYouFeed = ({
  sessionId,
  sessionImage,
  initialPosts,
}: ForYouFeedProps) => {
  const { fromTop } = useScrollHistory((state) => state);
  const lastPostRef = React.useRef();
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 0.7,
  });

  const { data, fetchNextPage, isFetching, isLoading, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["for-you-feed"],
      queryFn: async ({ pageParam }) => {
        const query = `/api/post?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}`;

        const { data } = await axios.get(query);
        return data as ExtendedPost[];
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

  const posts: ExtendedPost[] =
    data?.pages.flatMap((page) => page) ?? initialPosts;

  React.useEffect(() => {
    window.scrollTo({ top: fromTop });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ul>
        {isLoading ? (
          <div className="h-full flex justify-center items-start mt-6">
            <Loader2 className="h-9 w-9 animate-spin stroke-blue" />
          </div>
        ) : (
          posts.map((post, index) => {
            if (index === posts.length - 1) {
              if (post.postType === "POST") {
                return (
                  <li key={post.id} ref={ref}>
                    <Post
                      post={post}
                      sessionId={sessionId}
                      styles="border-b"
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
                    styles="border-b"
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
      {/* {!isLoading && isFetching && (
        <li className="pb-6 h-full flex justify-center items-start mt-6">
          <Loader2 className="h-9 w-9 animate-spin stroke-blue" />
        </li>
      )} */}
      {/* {!hasNextPage && !isFetching && !isLoading && (
        <li className="pb-6 h-full flex justify-center items-start mt-6">
          <p>No more posts</p>
        </li>
      )} */}
    </>
  );
};
export default ForYouFeed;
