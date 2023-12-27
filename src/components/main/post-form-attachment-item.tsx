"use client";

import { Button } from "@nextui-org/react";

import Icons from "@/components/icons";
import { cn } from "@/lib/utils";

type PostFormAttachmentItemProps = {
  url: string;
  fill: boolean;
  isPending: boolean;
  isUploading: boolean;
  handleRemove?: (url: string) => void;
};

const PostFormAttachmentItem = ({
  url,
  fill,
  isPending,
  isUploading,
  handleRemove,
}: PostFormAttachmentItemProps) => {
  const attachmentItemStyles = cn(
    "overflow-hidden relative rounded-2xl shadow",
    {
      "row-span-2": fill,
    }
  );
  return (
    <div className={attachmentItemStyles}>
      {handleRemove && (
        <div className="absolute right-1 top-1">
          {isPending ||
            (!isUploading && (
              <Button
                disabled={isPending || isUploading}
                onClick={() => handleRemove(url)}
                isIconOnly
                size="sm"
                className="absolute bg-black/70 rounded-full z-50 right-1 top-1"
              >
                <Icons.close className="h-[18px] w-[18px] fill-text" />
              </Button>
            ))}
        </div>
      )}
      <img className="h-full w-full object-cover" alt="Attachment" src={url} />
    </div>
  );
};
export default PostFormAttachmentItem;
