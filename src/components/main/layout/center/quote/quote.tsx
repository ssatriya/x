"use client";

import { ExtendedPost, SelectUser } from "@/lib/db/schema";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import PostUsername from "@/components/main/layout/center/user-detail/quote/quote-username";
import TooltipUser from "../user-detail/tooltip-user";
import Link from "next/link";
import { Avatar, Button } from "@nextui-org/react";

import { formatTimeToNow, removeAtSymbol } from "@/lib/utils";
import Icons from "@/components/icons";
import PostAttachment from "@/components/main/post-attachment";
import PostActionButton from "@/components/main/action-button/post-action-button";
import QuoteUsername from "@/components/main/layout/center/user-detail/quote/quote-username";
import TooltipUserQuote from "@/components/main/layout/center/user-detail/quote/tooltip-user-quote";

type QuoteProps = {
  post: ExtendedPost;
  sessionId: SelectUser["id"];
  sessionImage: SelectUser["image"];
};
const Quote = ({ post, sessionId, sessionImage }: QuoteProps) => {
  const usernameWithoutAt = removeAtSymbol(post.users.username!);
  const usernameWithoutAtForQuotedPost = removeAtSymbol(
    post.quoted[0].post.users.username!
  );

  const cfg = {};
  let html = "";
  // @ts-ignore
  if (post && post.content) {
    // @ts-ignore
    const parsed = JSON.parse(post.content);
    const converter = new QuillDeltaToHtmlConverter(parsed.ops, cfg);
    const converted = converter.convert();
    if (converted !== "<p><br/></p>") {
      html = converted;
    }
  }

  const cfg2 = {};
  let quotedPost = "";
  // @ts-ignore
  if (post && post.quoted[0]) {
    // @ts-ignore
    const parsed = JSON.parse(post.quoted[0].post.content);
    const converter = new QuillDeltaToHtmlConverter(parsed.ops, cfg2);
    const converted = converter.convert();
    if (converted !== "<p><br/></p>") {
      quotedPost = converted;
    }
  }

  return (
    <div className="hover:bg-hover/30 transition-colors cursor-pointer flex justify-between pt-2 px-4 gap-3 border-b relative">
      <Link
        href={`/${usernameWithoutAt}/status/${post.id}`}
        className="absolute inset-0"
      />
      <div className="h-fit">
        <TooltipUser post={post}>
          <Link href={`/${usernameWithoutAt}`}>
            <Avatar
              showFallback
              src={post.users.image ? post.users.image : undefined}
            />
          </Link>
        </TooltipUser>
      </div>

      <div className="w-full flex flex-col">
        <div className="flex w-full justify-between">
          <div className="flex items-center gap-2">
            <PostUsername post={post} align="row" />
            <span className="text-gray">·</span>
            <p className="text-gray">
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
        <div className="flex flex-col gap-2">
          {html.length > 0 && (
            <div dangerouslySetInnerHTML={{ __html: html }} />
          )}
          {post.imageUrl && (
            <div className="flex justify-center">
              {post.imageUrl && (
                <PostAttachment
                  sessionId={sessionId}
                  post={post}
                  sessionImage={sessionImage}
                />
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col space-y-3">
          <div className="hover:bg-[#0e0e0e] transition-colors cursor-pointer flex h-fit overflow-hidden flex-col justify-between pt-4 px-4 mt-2 border rounded-2xl border-[#2f3336] z-10 relative">
            <Link
              href={`/${usernameWithoutAtForQuotedPost}/status/${post.quoted[0].post.id}`}
              className="absolute inset-0"
            />
            <div className="flex gap-2 items-center mb-1">
              <TooltipUserQuote post={post.quoted[0].post}>
                <Avatar
                  className="w-5 h-5"
                  showFallback
                  src={
                    post.quoted[0].post.users.image
                      ? post.quoted[0].post.users.image
                      : undefined
                  }
                  size="sm"
                />
              </TooltipUserQuote>
              <div className="flex items-center gap-2">
                <QuoteUsername post={post.quoted[0].post} align="row" />
                <span className="text-gray">·</span>
                <p className="text-[#555b61]">
                  {post.quoted[0].post.createdAt &&
                    formatTimeToNow(new Date(post.quoted[0].post.createdAt))}
                </p>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <div>
                {quotedPost.length > 0 && (
                  <div
                    className="pb-4"
                    dangerouslySetInnerHTML={{ __html: quotedPost }}
                  />
                )}
              </div>
              {post.quoted[0] && post.quoted[0].post.imageUrl && (
                <div className="mb-2">
                  {/* <QuoteAttachment
                    currentUser={currentUser}
                    imageUrl={post.original_repost.image_url}
                    post={post}
                  /> */}
                </div>
              )}
            </div>
          </div>
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
export default Quote;
