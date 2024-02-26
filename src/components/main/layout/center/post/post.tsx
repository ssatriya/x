"use client";

import Icons from "@/components/icons";
import { cn, formatTimeToNow, removeAtSymbol } from "@/lib/utils";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import * as React from "react";
import PostUsername from "../user-detail/post-username";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import PostAvatar from "../user-detail/post-avatar";
import PostAttachment from "../../../post-attachment";
import PostActionButton from "@/components/main/action-button/post-action-button";
import { ExtendedPost, SelectUser } from "@/lib/db/schema";
import { useWindowScroll } from "@mantine/hooks";
import { useScrollHistory } from "@/hooks/useScrollHistory";

type PostProps = {
  post: ExtendedPost;
  sessionId: string;
  sessionImage: SelectUser["image"];
  styles?: string;
};
const Post = ({ post, sessionId, sessionImage, styles }: PostProps) => {
  const usernameWithoutAt = removeAtSymbol(post.users.username!);
  const [scroll] = useWindowScroll();
  const { setFromTop } = useScrollHistory((state) => state);
  const postURL = `/${usernameWithoutAt}/status/${post.id}`;

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

  // const { prevPath } = usePrevPath((state) => state);
  const onPostClick = () => {
    setFromTop(scroll.y);
  };

  return (
    <div
      className={cn(
        styles,
        "relative hover:bg-hover/30 transition-colors cursor-pointer flex justify-between pt-3 px-4 gap-3"
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <Link href={postURL} onClick={onPostClick} className="absolute inset-0" />
      <div className="z-10 h-fit">
        <PostAvatar
          sessionId={sessionId}
          post={post}
          usernameWithoutAt={usernameWithoutAt}
        />
      </div>
      <div className="w-full flex flex-col h-full">
        <div className="flex w-full justify-between">
          <div className="flex items-center gap-2 z-10">
            <PostUsername post={post} align="row" />
            <span className="text-gray">·</span>
            <p className="text-gray w-fit">
              {formatTimeToNow(new Date(post.createdAt))}
            </p>
          </div>
          <div className="relative right-8 bottom-1">
            <Button
              isIconOnly
              size="sm"
              className="absolute rounded-full bg-transparent data-[hover=true]:bg-blue/10 group"
            >
              <Icons.more className="h-4 w-4 fill-gray group-data-[hover=true]:fill-blue" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <div>
            {html.length > 0 && (
              <div
                dangerouslySetInnerHTML={{ __html: html }}
                className="mobile:text-[15px] mobile:leading-5"
              />
            )}
          </div>
          {post.imageUrl && (
            <PostAttachment
              sessionId={sessionId}
              sessionImage={sessionImage}
              post={post}
            />
          )}
        </div>
        <div>
          <PostActionButton
            post={post}
            sessionId={sessionId}
            sessionImage={sessionImage}
          />
        </div>
      </div>
    </div>
  );
};
export default Post;
