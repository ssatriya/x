"use client";

import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { Button, Divider } from "@nextui-org/react";
import Icons from "@/components/icons";

import { SelectUser, TestSinglePageRepliedTo } from "@/lib/db/schema";
import { formatSinglePostDate, removeAtSymbol } from "@/lib/utils";

import PostAvatar from "@/components/main/layout/center/user-detail/post-avatar";
import PostAttachment from "@/components/main/post-attachment";
import PostUsername from "@/components/main/layout/center/user-detail/post-username";
import PostActionButton from "@/components/main/action-button/post-action-button";
import SinglePostReply from "@/components/main/reply/single-post/single-post-reply";

import TestReply from "../reply/test-reply";

type SinglePostProps = {
  singlePost: TestSinglePageRepliedTo;
  sessionImage: SelectUser["image"];
  sessionId: SelectUser["id"];
};

const SinglePost = ({
  singlePost,
  sessionId,
  sessionImage,
}: SinglePostProps) => {
  const usernameWithoutAt = removeAtSymbol(singlePost?.users.username!);

  const cfg = {};
  let html = "";
  // @ts-ignore
  if (singlePost && singlePost.content) {
    // @ts-ignore
    const parsed = JSON.parse(singlePost.content);
    const converter = new QuillDeltaToHtmlConverter(parsed.ops, cfg);
    const converted = converter.convert();
    if (converted !== "<p><br/></p>") {
      html = converted;
    }
  }

  // Getting the replied post, the one that appear above your reply.
  // Try to get the one that appear under it
  // console.log(singlePost.replys[0].repliedPost.users.name);

  return (
    <div className="pt-3">
      <div className="px-4">
        <div className="flex justify-between gap-4">
          <div className="h-fit">
            <PostAvatar
              post={singlePost}
              sessionId={sessionId}
              usernameWithoutAt={usernameWithoutAt}
            />
          </div>

          <div className="relative w-full flex justify-between items-center">
            <PostUsername post={singlePost} align="column" />
            <Button
              isIconOnly
              size="sm"
              className="rounded-full bg-transparent hover:bg-blue/10 absolute top-0 right-0 group"
            >
              <Icons.more className="h-4 w-4 fill-gray group-hover:fill-blue" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col space-y-3 my-4">
          <div>
            {html.length > 0 && (
              <div dangerouslySetInnerHTML={{ __html: html }} />
            )}
          </div>
          {singlePost?.imageUrl && (
            <PostAttachment
              post={singlePost}
              sessionId={sessionId}
              sessionImage={sessionImage}
            />
          )}
          <div className="flex gap-2 items-center">
            <p className="text-[15px] leading-5 text-gray hover:underline cursor-pointer">
              {formatSinglePostDate(singlePost?.createdAt)}
            </p>
            <span className="text-gray">·</span>
            <p className="text-white font-semibold">
              120.3K <span className="text-gray font-normal">Views</span>
            </p>
          </div>
        </div>
        <Divider orientation="horizontal" className="bg-border" />
        <PostActionButton
          post={singlePost}
          sessionId={sessionId}
          sessionImage={sessionImage}
          singlePost={true}
        />
      </div>
      <div className="pb-2 px-4">
        <SinglePostReply
          sessionId={sessionId}
          sessionImage={sessionImage}
          singlePost={singlePost}
        />
      </div>
      <Divider orientation="horizontal" className="bg-border" />
      {/* <PostReply
        post={singlePost}
        sessionId={sessionId}
        sessionImage={sessionImage}
      /> */}
      <TestReply
        post={singlePost}
        sessionId={sessionId}
        sessionImage={sessionImage}
      />
    </div>
  );
};
export default SinglePost;
