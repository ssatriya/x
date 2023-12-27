"use client";

import { PostUser } from "@/types";
import TooltipUserReply from "./tooltip-user-reply";
import Link from "next/link";
import Image from "next/image";
import { ExtendedReply, SelectUser } from "@/lib/db/schema";

type ReplyAvatarProps = {
  replyPost: ExtendedReply;
  sessionId: SelectUser["id"];
  usernameWithoutAt: string;
};

const ReplyAvatar = ({
  replyPost,
  sessionId,
  usernameWithoutAt,
}: ReplyAvatarProps) => {
  return (
    <TooltipUserReply post={replyPost}>
      <Link href={`/${usernameWithoutAt}`}>
        {/* <Avatar showFallback src={avatarUrl} /> */}
        <div className="w-10 h-10">
          <Image
            src={replyPost.users.image!}
            height={40}
            width={40}
            priority
            alt="avatar"
            className="rounded-full"
          />
        </div>
      </Link>
    </TooltipUserReply>
  );
};
export default ReplyAvatar;
