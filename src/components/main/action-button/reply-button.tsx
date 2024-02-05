"use client";

import * as React from "react";
import { Button, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import { usePrevious } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";

import { ExtendedPost, SelectReplys, SelectUser } from "@/lib/db/schema";

import Icons from "@/components/icons";
import { cn } from "@/lib/utils";
import ReplyModal from "@/components/main/reply/reply-modal";

type ReplyButtonProps = {
  post: ExtendedPost;
  sessionImage: SelectUser["image"];
  sessionId: SelectUser["id"];
};

const ReplyButton = ({ post, sessionImage, sessionId }: ReplyButtonProps) => {
  const [localReplysData, setLocalReplysData] = React.useState<SelectReplys[]>(
    post.repliedPost
  );
  const previousRepliesData = usePrevious<SelectReplys[]>(localReplysData);

  const {
    isOpen: isOpenReplyModal,
    onOpen: onOpenReplyModal,
    onOpenChange: onOpenChangeReplyModal,
  } = useDisclosure();

  const { data: replyData } = useQuery({
    queryKey: ["replyData", post.id],
    queryFn: async () => {
      const { data } = await axios.get("/api/post/reply", {
        params: {
          postId: post.id,
        },
      });

      return data as SelectReplys[];
    },
  });

  React.useEffect(() => {
    if (replyData) {
      setLocalReplysData(replyData);
    }
  }, [replyData]);

  return (
    <div className="flex relative items-center group right-2">
      <Button
        onPress={onOpenReplyModal}
        size="sm"
        isIconOnly
        className="rounded-full bg-transparent flex items-center justify-center gap-2 group-hover:bg-blue/10"
      >
        <Icons.reply
          className={cn("w-[18px] h-[18px] fill-gray group-hover:fill-blue")}
        />
      </Button>
      <p className={cn("text-gray text-sm group-hover:text-blue")}>
        {localReplysData.length}
      </p>

      <ReplyModal
        isOpenReplyModal={isOpenReplyModal}
        onOpenChangeReplyModal={onOpenChangeReplyModal}
        post={post}
        sessionId={sessionId}
        sessionImage={sessionImage}
      />
    </div>
  );
};
export default ReplyButton;
