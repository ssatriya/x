"use client";

import * as React from "react";

import { Button, Divider } from "@nextui-org/react";
import Icons from "@/components/icons";
import { cn } from "@/lib/utils";
import ImageSlider from "@/components/main/image-slider";
import PostLightboxContent from "./post-lightbox-content";
import { ExtendedPost, SelectUser } from "@/lib/db/schema";
import { usePreviousPath } from "@/hooks/usePreviousPath";
import PostActionButton from "@/components/main/action-button/post-action-button";
import { usePathname } from "next/navigation";
import PostReply from "../../reply/post-reply";

type PostLightboxProps = {
  onClose: () => void;
  isOpen: boolean;
  imageUrlArray: string[];
  post: ExtendedPost;
  sessionId: SelectUser["id"];
  sessionImage: SelectUser["image"];
};

const PostLightbox = ({
  onClose,
  isOpen,
  imageUrlArray,
  post,
  sessionId,
  sessionImage,
}: PostLightboxProps) => {
  const previousPath = usePreviousPath((state) => state.previousPath);
  const [isLightboxPostOpen, setIsLightboxPostOpen] = React.useState(true);

  React.useEffect(() => {
    if (!isOpen) {
      // window.history.pushState("page2", "Title", previousPath);
    }
  }, [previousPath, isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleHide = () => {
    setIsLightboxPostOpen((prev) => !prev);
  };

  return (
    isOpen && (
      <>
        <div
          role="dialog"
          className="fixed inset-0 flex items-center justify-center z-[50]"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <div
            className="fixed inset-0 bg-black/70 z-40"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          />
          <div className="flex relative w-full h-full z-50">
            <div className="relative flex-1">
              <Button
                onClick={onClose}
                isIconOnly
                disableAnimation
                className="rounded-full absolute left-3 top-3 z-[60] bg-transparent lg:hover:bg-text/10"
              >
                <Icons.close className="fill-text h-5 w-5" strokeWidth={2} />
              </Button>
              <Button
                onClick={handleHide}
                isIconOnly
                disableAnimation
                className="rounded-full right-3 z-[60] top-3 bg-transparent hover:bg-text/10 lg:absolute"
              >
                <Icons.hideIcon
                  className={cn(
                    "fill-text h-5 w-5",
                    !isLightboxPostOpen && "rotate-180"
                  )}
                  strokeWidth={2}
                />
              </Button>
              <div className="flex flex-col justify-center items-center h-full relative">
                <div className="flex h-full w-full">
                  <ImageSlider
                    slides={imageUrlArray}
                    post={post}
                    onClose={onClose}
                    isOpen={isOpen}
                  />
                </div>
                <div className="w-fit">
                  <PostActionButton
                    post={post}
                    sessionId={sessionId}
                    sessionImage={sessionImage}
                  />
                </div>
                <div
                  className="z-40 absolute bottom-1"
                  onClick={(e) => e.stopPropagation()}
                ></div>
              </div>
            </div>

            {isLightboxPostOpen && (
              <div
                className="flex-none w-[350px] bg-black border-l z-40 h-full pt-3 overflow-y-auto hidden lg:block"
                onClick={(e) => e.stopPropagation()}
              >
                <PostLightboxContent
                  post={post}
                  sessionId={sessionId}
                  sessionImage={sessionImage}
                />
                <Divider
                  orientation="horizontal"
                  className="bg-border h-[1px]"
                />
                <PostReply
                  post={post}
                  sessionId={sessionId}
                  sessionImage={sessionImage}
                />
              </div>
            )}
          </div>
        </div>
      </>
    )
  );
};
export default PostLightbox;
