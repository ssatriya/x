import { cn, removeAtSymbol } from "@/lib/utils";
import { PostUser } from "@/types";
import { useDisclosure } from "@nextui-org/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import PostLightbox from "./layout/center/post/lightbox/post-lightbox";
import { ExtendedPost, SelectUser } from "@/lib/db/schema";
import { useImageNumber } from "@/hooks/useImageNumber";
import { usePreviousPath } from "@/hooks/usePreviousPath";
import Link from "next/link";

type PostAttachmentProps = {
  post: ExtendedPost;
  sessionId: SelectUser["id"];
  sessionImage: SelectUser["image"];
};

const PostAttachment = ({
  post,
  sessionId,
  sessionImage,
}: PostAttachmentProps) => {
  const router = useRouter();
  const setImageNumber = useImageNumber((state) => state.setImageNumber);
  // const setPreviousPath = usePreviousPath((state) => state.setPreviousPath);

  const { isOpen, onClose, onOpenChange, onOpen } = useDisclosure();

  const scrollClickHandle = () => {
    const usernameWithoutAt = removeAtSymbol(post.users.username!);
    const singlePost = `/${usernameWithoutAt}/status/${post.id}`;

    window.open(singlePost);
  };

  const onAttachmentClick = () => {
    console.log("click");
    // setPreviousPath(pathname);
  };

  const imageUrlArray: string[] = post.imageUrl?.split(",") || [];

  const className = cn(
    imageUrlArray.length > 0 ? "h-[300px] mb-4" : "",
    "grid gap-[2px] w-full",
    {
      "grid-rows-1": imageUrlArray.length <= 2,
      "grid-rows-2": imageUrlArray.length > 2,
      "grid-cols-1": imageUrlArray.length === 1,
      "grid-cols-2": imageUrlArray.length > 1,
    }
  );

  const usernameWithoutAt = removeAtSymbol(post.users.username!);

  return (
    <div className={cn(className)}>
      {imageUrlArray.map((image, i) => {
        const fill = imageUrlArray.length === 3 && i === 0;
        const innerClassName = cn("overflow-hidden relative shadow", {
          "row-span-2": fill,
        });

        let borderImage: string = "rounded-2xl";

        if (imageUrlArray.length === 4) {
          borderImage = cn({
            "rounded-tl-2xl": i === 0,
            "rounded-tr-2xl": i === 1,
            "rounded-bl-2xl": i === 2,
            "rounded-br-2xl": i === 3,
          });
        } else if (imageUrlArray.length === 3) {
          borderImage = cn({
            "rounded-l-2xl": i === 0,
            "rounded-tr-2xl": i === 1,
            "rounded-br-2xl": i === 2,
          });
        } else if (imageUrlArray.length === 2) {
          borderImage = cn({
            "rounded-l-2xl": i === 0,
            "rounded-r-2xl": i === 1,
          });
        }

        return (
          <div key={image + i} className={cn(innerClassName)}>
            <div
              onMouseDown={(e) => {
                if (e.button === 1) {
                  e.stopPropagation();
                  scrollClickHandle();
                }
              }}
            >
              <Link
                href={`/${usernameWithoutAt}/status/${post.id}/photo`}
                scroll={false}
              >
                <Image
                  onClick={() => {
                    setImageNumber(i + 1);
                  }}
                  src={image}
                  fill
                  sizes="(max-widht: 600px) 512px"
                  className={cn(
                    "h-full w-full object-cover border cursor-pointer",
                    borderImage
                  )}
                  alt="attachment"
                  priority
                />
              </Link>
            </div>
          </div>
        );
      })}
      <PostLightbox
        imageUrlArray={imageUrlArray}
        isOpen={isOpen}
        onClose={onClose}
        post={post}
        sessionId={sessionId}
        sessionImage={sessionImage}
      />
    </div>
  );
};
export default PostAttachment;
