"use client";

import * as React from "react";

import Icons from "@/components/icons";
import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/react";
import { usePrevious } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ExtendedPost, SelectLike } from "@/lib/db/schema";

type LikeButtonProps = {
  post: ExtendedPost;
  sessionId: string;
};

const LikeButton = ({ post, sessionId }: LikeButtonProps) => {
  const queryClient = useQueryClient();

  const [localLikesData, setLocalLikesData] = React.useState<SelectLike[]>(
    post.likes
  );
  const previousLikesData = usePrevious<SelectLike[]>(localLikesData);

  const { data: likeData } = useQuery({
    queryKey: ["likeData", post.id],
    queryFn: async () => {
      const { data } = await axios.get("/api/post/like", {
        params: {
          postId: post.id,
        },
      });

      return data as SelectLike[];
    },
  });

  React.useEffect(() => {
    if (likeData) {
      setLocalLikesData(likeData);
    }
  }, [likeData]);

  const { mutate: addLike } = useMutation({
    mutationKey: ["addLike", post.id],
    mutationFn: async () => {
      const { data } = await axios.patch("/api/post/like", {
        postId: post.id,
      });

      return data as SelectLike[];
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["likeData", post.id],
      });

      const likedIndex = localLikesData.findIndex(
        (like) =>
          like.likePostTargetId === post.id && like.userOriginId === sessionId
      );

      if (likedIndex === 0) {
        setLocalLikesData((prevLikes) => {
          const newLikes = [...prevLikes];
          newLikes.splice(likedIndex, 1);
          return newLikes;
        });
      } else {
        setLocalLikesData((prevLikes) => [
          ...prevLikes,
          {
            id: Math.random() + "",
            likePostTargetId: post.id,
            userOriginId: sessionId,
            createdAt: new Date(),
          },
        ]);
      }
    },
    onError: (error) => {
      if (error && previousLikesData) {
        setLocalLikesData(previousLikesData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["likeData", post.id] });
    },
  });

  let isLikedByLoggedInUser: boolean = false;

  if (sessionId) {
    isLikedByLoggedInUser = localLikesData.some(
      (like) =>
        like.likePostTargetId === post.id && like.userOriginId === sessionId
    );
  }

  return (
    <div className="flex items-center group">
      <Button
        onClick={() => addLike()}
        size="sm"
        isIconOnly
        className="rounded-full bg-transparent flex items-center justify-center group-hover:bg-red-500/10"
      >
        <Icons.like
          strokeWidth={2}
          className={cn(
            isLikedByLoggedInUser
              ? "fill-red-500"
              : "fill-transparent stroke-gray group-hover:stroke-red-500",
            "w-[18px] h-[18px]"
          )}
        />
      </Button>
      <p
        className={cn(
          isLikedByLoggedInUser ? "text-red-500" : " text-gray ",
          "text-sm group-hover:text-red-500 tabular-nums"
        )}
      >
        {localLikesData.length}
      </p>
    </div>
  );
};
export default LikeButton;
