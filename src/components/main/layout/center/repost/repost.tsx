"use client";

import PostActionButton from "@/components/main/action-button/post-action-button";
import { ExtendedPost, OriginalPost, SelectUser } from "@/lib/db/schema";
import { formatTimeToNow, removeAtSymbol } from "@/lib/utils";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import PostAvatar from "../user-detail/post-avatar";
import Icons from "@/components/icons";
import Link from "next/link";
import PostUsername from "../user-detail/post-username";
import PostAttachment from "@/components/main/post-attachment";

type RepostProps = {
  post: ExtendedPost;
  sessionId: SelectUser["id"];
  sessionImage: SelectUser["image"];
};

const Repost = ({ post, sessionId, sessionImage }: RepostProps) => {
  const usernameWithoutAt = removeAtSymbol(post.users.username!);
  const originalPostURL = `/${usernameWithoutAt}/status/${post.id}`;

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
    <div className="relative hover:bg-hover/30 transition-colors cursor-pointer flex justify-between pt-3 px-4 gap-2 border-b">
      <Link href={originalPostURL} className="absolute inset-0" />
      <div className="h-fit flex flex-col items-end">
        <div className="mb-1">
          <Icons.repost className="w-4 h-4 fill-gray" />
        </div>
        <PostAvatar
          post={post}
          sessionId={sessionId}
          usernameWithoutAt={usernameWithoutAt}
        />
      </div>
      <div className="w-full flex flex-col">
        <div className="font-bold text-gray text-[13px] leading-4 mb-1 z-20">
          <p>You reposted</p>
        </div>
        <div className="flex items-center gap-2">
          <PostUsername post={post} align="row" />
          <span className="text-gray">·</span>
          <p className="text-gray">
            {formatTimeToNow(new Date(post.createdAt))}
          </p>
        </div>
        <div className="flex flex-col space-y-3">
          <div>
            {html.length > 0 && (
              <div dangerouslySetInnerHTML={{ __html: html }} />
            )}
          </div>
          {post.imageUrl && (
            <PostAttachment
              post={post}
              sessionId={sessionId}
              sessionImage={sessionImage}
            />
          )}
        </div>

        <PostActionButton
          post={post}
          sessionId={sessionId}
          sessionImage={sessionImage}
        />
      </div>
    </div>
  );
};
export default Repost;
