import { Button } from "@nextui-org/react";
import Icons from "../../icons";
import ReplyButton from "./reply-button";
import LikeButton from "./like-button";
import RepostButton from "./repost-button";
import { ExtendedPost, SelectUser } from "@/lib/db/schema";

type PostActionButtonProps = {
  post: ExtendedPost;
  sessionId: SelectUser["id"];
  sessionImage: SelectUser["image"];
  singlePost?: boolean;
};

const PostActionButton = ({
  post,
  sessionId,
  sessionImage,
  singlePost = false,
}: PostActionButtonProps) => {
  return (
    <div className="w-full flex justify-between items-center gap-4 py-2">
      <ReplyButton
        post={post}
        sessionImage={sessionImage}
        sessionId={sessionId}
      />
      <RepostButton
        post={post}
        sessionImage={sessionImage}
        sessionId={sessionId}
      />
      <LikeButton post={post} sessionId={sessionId} />

      <div className="flex items-center group">
        {singlePost ? (
          <>
            <Button
              aria-label="bookmark"
              size="sm"
              isIconOnly
              className="rounded-full bg-transparent flex items-center justify-center gap-2 group-hover:bg-blue/10"
            >
              <Icons.bookmark className="fill-gray w-[18px] h-[18px] group-hover:fill-blue" />
            </Button>
            <p className="text-sm text-gray group-hover:text-blue">0</p>
          </>
        ) : (
          <>
            <Button
              size="sm"
              isIconOnly
              className="rounded-full bg-transparent flex items-center justify-center gap-2 group-hover:bg-blue/10"
            >
              <Icons.view className="fill-gray w-[18px] h-[18px] group-hover:fill-blue" />
            </Button>
            <p className="text-sm text-gray group-hover:text-blue">
              {post.view}
            </p>
          </>
        )}
      </div>

      <div className="flex items-center group">
        <Button
          size="sm"
          isIconOnly
          className="rounded-full bg-transparent flex items-center justify-center gap-2 group-hover:bg-blue/10"
        >
          <Icons.share className="fill-gray w-[18px] h-[18px] group-hover:fill-blue" />
        </Button>
      </div>
    </div>
  );
};
export default PostActionButton;
