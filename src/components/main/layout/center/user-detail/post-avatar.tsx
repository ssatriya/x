"use client";

import { PostUser } from "@/types";
import TooltipUser from "./tooltip-user";
import Link from "next/link";
import Image from "next/image";
import { ExtendedPost, SelectUser } from "@/lib/db/schema";

type PostAvatarProps = {
  post: ExtendedPost;
  sessionId: SelectUser["id"];
  usernameWithoutAt: string;
};

const PostAvatar = ({
  post,
  sessionId,
  usernameWithoutAt,
}: PostAvatarProps) => {
  return (
    <TooltipUser post={post}>
      <Link href={`/${usernameWithoutAt}`}>
        {/* <Avatar showFallback src={avatarUrl} /> */}
        <div className="w-10 h-10">
          <Image
            src={post.users.image!}
            height={40}
            width={40}
            priority
            alt="avatar"
            className="rounded-full"
          />
        </div>
      </Link>
    </TooltipUser>
  );
};
export default PostAvatar;
