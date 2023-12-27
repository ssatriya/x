"use client";

import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { Avatar } from "@nextui-org/react";

import { ExtendedPost } from "@/lib/db/schema";
import { formatTimeToNow } from "@/lib/utils";

type ReplyTargetProps = {
  post: ExtendedPost;
};
const ReplyTarget = ({ post }: ReplyTargetProps) => {
  const cfg = {};
  let html = "";
  // @ts-ignore
  if (post.content) {
    // @ts-ignore
    const parsed = JSON.parse(post.content);
    const converter = new QuillDeltaToHtmlConverter(parsed.ops, cfg);
    const converted = converter.convert();
    if (converted !== "<p><br/></p>") {
      html = converted;
    }
  }

  return (
    <div className="flex gap-3">
      <div className="flex flex-col h-full">
        <Avatar src={post?.users.image ? post?.users.image : undefined} />
        <div className="w-[2px] h-full bg-gray" />
      </div>
      <div className="flex flex-col">
        <div className="flex gap-2">
          <p className="font-bold text-[15px]">{post?.users.name}</p>
          <p className="text-[15px] text-gray">{post?.users.username}</p>
          <span className="text-gray">·</span>
          <p className="text-gray text-[15px]">
            {formatTimeToNow(new Date(post.createdAt))}
          </p>
        </div>
        <div>
          <div
            className="text-[15px] leading-5 pb-3"
            dangerouslySetInnerHTML={{
              __html: html + (post?.imageUrl && post.imageUrl),
            }}
          />
        </div>
        <div className="pt-2 pb-4 text-[15px] leading-5">
          <p className="text-gray">
            Replying to{" "}
            <span className="text-blue">{post.users.username!}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
export default ReplyTarget;
