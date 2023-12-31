"use client";

import PostAttachment from "@/components/main/post-attachment";
import { ReplyWithRepliedTo, SelectUser } from "@/lib/db/schema";
import { formatTimeToNow, removeAtSymbol } from "@/lib/utils";
import Link from "next/link";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import ReplyAvatar from "../user-detail/reply/reply-avatar";
import ReplyUsername from "../user-detail/reply/reply-username";
import PostActionButton from "@/components/main/action-button/post-action-button";

type ReplyWithRepliedToProps = {
  replyPost: ReplyWithRepliedTo;
  sessionId: SelectUser["id"];
  sessionImage: SelectUser["image"];
};

const ReplyWithRepliedTo = ({
  replyPost,
  sessionId,
  sessionImage,
}: ReplyWithRepliedToProps) => {
  const usernameWithoutAt = removeAtSymbol(replyPost.users.username!);
  const postURL = `/${usernameWithoutAt}/status/${replyPost.id}`;

  const cfg = {};
  let html = "";
  // @ts-ignore
  if (replyPost.content) {
    // @ts-ignore
    const parsed = JSON.parse(replyPost.content);
    const converter = new QuillDeltaToHtmlConverter(parsed.ops, cfg);
    const converted = converter.convert();
    if (converted !== "<p><br/></p>") {
      html = converted;
    }
  }

  return (
    <>
      <div className="relative hover:bg-hover/30 transition-colors cursor-pointer flex justify-between pt-3 px-4 gap-2 border-b">
        <Link href={postURL} className="absolute inset-0" />
        <div className="h-fit">
          <ReplyAvatar
            replyPost={replyPost}
            sessionId={sessionId}
            usernameWithoutAt={usernameWithoutAt}
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="w-full flex flex-col">
            <div className="flex items-center gap-2">
              <ReplyUsername post={replyPost} align="row" />
              <span className="text-gray">·</span>
              <p className="text-gray">
                {formatTimeToNow(new Date(replyPost.createdAt))}
              </p>
            </div>
            <div className="text-[15px] leading-5">
              <p className="text-gray">
                Replying to{" "}
                <span className="text-blue">
                  {replyPost.replys[0].repliedPost.users.username}
                </span>
              </p>
            </div>
            <div className="flex flex-col space-y-3">
              <div>
                {html.length > 0 && (
                  <div dangerouslySetInnerHTML={{ __html: html }} />
                )}
              </div>
              {replyPost.imageUrl && (
                <PostAttachment
                  post={replyPost}
                  sessionId={sessionId}
                  sessionImage={sessionImage}
                />
              )}
            </div>
          </div>

          <PostActionButton
            post={replyPost}
            sessionId={sessionId}
            sessionImage={sessionImage}
          />
        </div>
      </div>
    </>
  );
};
export default ReplyWithRepliedTo;
