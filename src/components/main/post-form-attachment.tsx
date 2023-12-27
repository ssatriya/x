"use client";

import { cn } from "@/lib/utils";
import { AttachmentType } from "@/types";
import PostFormAttachmentItem from "@/components/main/post-form-attachment-item";

type PostFormAttachmentProps = {
  files: AttachmentType[];
  isPending: boolean;
  isUploading: boolean;
  handleRemove?: (url: string) => void;
};
const PostFormAttachment = ({
  files,
  isPending,
  isUploading,
  handleRemove,
}: PostFormAttachmentProps) => {
  const gridStyles = cn(
    files.length > 0 ? "h-[300px] mb-4" : "",
    "grid gap-2 w-full",
    {
      "grid-rows-1": files.length <= 2,
      "grid-rows-2": files.length > 2,
      "grid-cols-1": files.length === 1,
      "grid-cols-2": files.length > 1,
    }
  );

  return (
    <div className={cn(gridStyles)}>
      {files.map((attachment, i) => (
        <PostFormAttachmentItem
          key={i}
          isPending={isPending}
          isUploading={isUploading}
          url={attachment.url}
          fill={files.length === 3 && i === 0}
          handleRemove={handleRemove}
        />
      ))}
    </div>
  );
};
export default PostFormAttachment;
