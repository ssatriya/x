import { cn, formatSinglePostDate, removeAtSymbol } from "@/lib/utils";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import PostAvatar from "../../user-detail/post-avatar";
import PostUsername from "../../user-detail/post-username";
import { Button, Divider } from "@nextui-org/react";
import Icons from "@/components/icons";
import { ExtendedPost, SelectUser } from "@/lib/db/schema";
import PostActionButton from "@/components/main/action-button/post-action-button";

type PostLightboxContentProps = {
  post: ExtendedPost;
  sessionId: SelectUser["id"];
  sessionImage: SelectUser["image"];
  styles?: string;
};

const PostLightboxContent = ({
  post,
  sessionId,
  sessionImage,
  styles,
}: PostLightboxContentProps) => {
  const usernameWithoutAt = removeAtSymbol(post?.users.username!);

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
    <div
      className={cn(
        styles,
        "relative hover:bg-hover/30 transition-colors flex justify-between gap-2 px-4 cursor-default"
      )}
    >
      <div className="w-full flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <PostAvatar
              sessionId={sessionId}
              post={post}
              usernameWithoutAt={usernameWithoutAt}
            />
            <PostUsername post={post} align="column" />
          </div>
          <div className="flex items-center">
            <Button
              size="sm"
              radius="full"
              className="font-bold text-sm leading-4 bg-text text-black"
            >
              Subscribe
            </Button>
            <Button
              isIconOnly
              size="sm"
              className="rounded-full bg-transparent hover:bg-blue/10 group"
            >
              <Icons.more className="h-4 w-4 fill-gray group-hover:fill-blue" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="mt-3">
            {html.length > 0 && (
              <div
                dangerouslySetInnerHTML={{ __html: html }}
                className="text-[17px] leading-6 cursor-text"
              />
            )}
          </div>
          <div className="mt-3">
            <p className="text-gray text-[15px] leading-5">
              {formatSinglePostDate(post.createdAt)}
            </p>
          </div>
          <Divider
            orientation="horizontal"
            className="bg-border h-[1px] mt-3"
          />
          <PostActionButton
            post={post}
            sessionId={sessionId}
            sessionImage={sessionImage}
          />
          {/* <InlineReplyFormEditor currentUser={currentUser} post={post} /> */}
        </div>
      </div>
    </div>
  );
};
export default PostLightboxContent;
