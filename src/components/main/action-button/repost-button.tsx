"use client";

import * as React from "react";

import Icons from "@/components/icons";
import { ExtendedPost, SelectRepost, SelectUser } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { useMediaQuery, usePrevious } from "@mantine/hooks";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import QuoteModal from "../quote/quote-modal";

type RepostButtonProps = {
  post: ExtendedPost;
  sessionId: SelectUser["id"];
  sessionImage: SelectUser["image"];
};

const RepostButton = ({ post, sessionId, sessionImage }: RepostButtonProps) => {
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery("(max-width: 480px)");

  const {
    isOpen: isOpenQuoteModal,
    onOpen: onOpenQuoteModal,
    onOpenChange: onOpenChangeQuoteModal,
  } = useDisclosure();

  const [localRepostsData, setLocalRepostsData] = React.useState<
    SelectRepost[]
  >(post.reposts);
  const previousRepostsData = usePrevious<SelectRepost[]>(localRepostsData);

  const { data: repostData } = useQuery({
    queryKey: ["repostData", post.id],
    queryFn: async () => {
      const { data } = await axios.get("/api/post/repost", {
        params: {
          postId: post.id,
        },
      });

      return data as SelectRepost[];
    },
  });

  React.useEffect(() => {
    if (repostData) {
      setLocalRepostsData(repostData);
    }
  }, [repostData]);

  const { mutate: repost } = useMutation({
    mutationKey: ["repostButton", post.id],
    mutationFn: async () => {
      const payload = {
        postId: post.id,
      };

      const { data } = await axios.patch("/api/post/repost", payload);
      return data as string;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["repostData", post.id] });

      const repostedIndex = localRepostsData.findIndex(
        (repost) =>
          repost.repostPostTargetId === post.id &&
          repost.userOriginId === sessionId
      );

      if (repostedIndex === 0) {
        setLocalRepostsData((prev) => {
          const newRepost = [...prev];
          newRepost.splice(repostedIndex, 1);
          return newRepost;
        });
      } else {
        setLocalRepostsData((prev) => [
          ...prev,
          {
            id: Math.random() + "",
            repostPostTargetId: post.id,
            userOriginId: sessionId,
            createdAt: new Date(),
          },
        ]);
      }
    },
    onError: (error) => {
      if (error && previousRepostsData) {
        setLocalRepostsData(previousRepostsData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["repostData", post.id] });
    },
  });

  let isRepostedByLoggedInUser: boolean = false;

  if (sessionId) {
    isRepostedByLoggedInUser = localRepostsData.some(
      (repost) =>
        repost.repostPostTargetId === post.id &&
        repost.userOriginId === sessionId
    );
  }

  return (
    <>
      <div className="flex items-center group">
        <Dropdown
          className="p-0 rounded-xl"
          classNames={{
            base: "bg-black min-w-[110px] shadow-normal",
          }}
        >
          <DropdownTrigger>
            <Button
              size="sm"
              isIconOnly
              className="rounded-full bg-transparent flex items-center justify-center gap-2 group-hover:bg-green-600/10"
            >
              <Icons.repost
                className={cn(
                  isRepostedByLoggedInUser
                    ? "fill-green-600"
                    : "fill-gray group-hover:fill-green-600",
                  "w-[18px] h-[18px]"
                )}
              />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="repost options" className="p-0">
            {isRepostedByLoggedInUser ? (
              <DropdownItem
                onClick={() => repost()}
                startContent={
                  <Icons.repost className="w-[18px] h-[18px] fill-white" />
                }
                key="repost"
                className="data-[hover=true]:bg-white/5 rounded-t-lg rounded-b-none px-4 py-3"
                textValue="Repost"
              >
                <p className="font-bold">Undo repost</p>
              </DropdownItem>
            ) : (
              <DropdownItem
                onClick={() => repost()}
                startContent={
                  <Icons.repost className="w-[18px] h-[18px] fill-white" />
                }
                key="repost"
                className="data-[hover=true]:bg-white/5 rounded-t-lg rounded-b-none px-4 py-3"
                textValue="Repost"
              >
                <p className="font-bold">Repost</p>
              </DropdownItem>
            )}
            <DropdownItem
              onPress={() => {
                // onOpenOption();
                // onOpen();
                onOpenQuoteModal();
              }}
              startContent={
                <Icons.quote className="w-[18px] h-[18px] fill-white" />
              }
              key="quote"
              textValue="Quote"
              className="data-[hover=true]:bg-white/5 rounded-b-lg rounded-t-none px-4 py-3"
            >
              <p className="font-bold">Quote</p>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <p
          className={cn(
            isRepostedByLoggedInUser ? "text-green-600" : " text-gray ",
            "text-sm group-hover:text-green-600 tabular-nums"
          )}
        >
          {localRepostsData.length}
        </p>
      </div>

      <QuoteModal
        isOpenQuoteModal={isOpenQuoteModal}
        onOpenChangeQuoteModal={onOpenChangeQuoteModal}
        sessionImage={sessionImage}
        post={post}
        sessionId={sessionId}
      />
    </>
  );
};
export default RepostButton;
