"use client";

import * as React from "react";

import Icons from "@/components/icons";
import {
  Avatar,
  Button,
  CircularProgress,
  Divider,
  Progress,
} from "@nextui-org/react";
import ReplyFormEditor from "../reply-form-editor";
import PostFormAttachment from "../../post-form-attachment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AttachmentType } from "@/types";
import { DeltaStatic } from "quill";
import { useUploadThing } from "@/lib/uploadthing";
import { ExtendedPost, SelectPost, SelectUser } from "@/lib/db/schema";
import axios from "axios";
import { cn } from "@/lib/utils";

type SinglePostReplyProps = {
  singlePost: ExtendedPost;
  sessionImage: SelectUser["image"];
  sessionId: SelectUser["id"];
};

const SinglePostReply = ({
  singlePost,
  sessionId,
  sessionImage,
}: SinglePostReplyProps) => {
  const queryClient = useQueryClient();

  const mediaRef = React.useRef<React.ElementRef<"input">>(null);

  const [files, setFiles] = React.useState<AttachmentType[]>([]);
  const [editorValue, setEditorValue] = React.useState<
    DeltaStatic | undefined
  >();
  const [charLength, setCharLength] = React.useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newAttachments: AttachmentType[] = Array.from(e.target.files).map(
        (file) => ({
          type: "IMAGE",
          url: URL.createObjectURL(file),
          mime: file.type,
          name: file.name,
          extension: file.name.split(".").pop() as string,
          size: file.size.toString(),
          file: file,
        })
      );

      setFiles((prevFiles) => [...prevFiles, ...newAttachments]);
    }
  };

  const handleMedia = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (mediaRef && mediaRef.current) {
      mediaRef.current.click();
    }
  };

  const handleFileRemove = (url: string) => {
    setFiles((prevFiles) =>
      prevFiles.filter((attachment) => attachment.url !== url)
    );
  };

  const { mutate: createReply, isPending } = useMutation({
    mutationKey: ["replyMutation"],
    mutationFn: async ({
      postTargetId,
      content,
      imageUrl,
    }: {
      postTargetId: SelectPost["id"];
      content: any;
      imageUrl: string;
    }) => {
      const payload = {
        postTargetId,
        content,
        imageUrl,
      };
      const { data } = await axios.post("/api/post/reply", payload);
      return data as string;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["replyData"],
      });
      setEditorValue(undefined);
      setFiles([]);
    },
  });

  const handleReplySubmit = async () => {
    if (files.length === 0 && charLength === 0) {
      return;
    }

    if (files.length > 0 && charLength === 0) {
      if (files.length > 0) {
        const allFiles: File[] = [];
        files.map((file) => allFiles.push(file.file));

        if (allFiles.length === files.length) {
          startUpload(allFiles);
          return;
        }
      }
    } else if (files.length > 0 && charLength > 0) {
      const allFiles: File[] = [];
      files.map((file) => allFiles.push(file.file));

      if (allFiles.length === files.length) {
        startUpload(allFiles);
        return;
      }
    } else if (files.length === 0 && charLength > 0) {
      createReply({
        content: editorValue,
        postTargetId: singlePost.id,
        imageUrl: "",
      });
      setEditorValue(undefined);
      return;
    }
  };

  const { isUploading, startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (file) => {
      if (file) {
        const fileUrl: string[] = [];
        file.map((f) => fileUrl.push(f.url));

        if (fileUrl.length === files.length) {
          createReply({
            content: editorValue,
            imageUrl: fileUrl.toString(),
            postTargetId: singlePost.id,
          });
        }
      }

      setFiles([]);
      setEditorValue(undefined);
    },
    onUploadError: (error) => {},
    onUploadProgress: (progress) => {},
  });

  let disabledByContent: boolean = true;

  if (charLength === 0 && files.length > 0) {
    disabledByContent = false;
  } else if (charLength > 0 && files.length === 0) {
    disabledByContent = false;
  } else if (charLength > 0 && files.length > 0) {
    disabledByContent = false;
  }

  const [isEditorFocus, setIsEditorFocus] = React.useState(false);

  const focusHandler = () => {
    setIsEditorFocus(true);
  };

  return (
    <>
      {isPending ||
        (isUploading && (
          <div className="relative">
            <Progress
              size="sm"
              aria-label="Posting..."
              isIndeterminate
              classNames={{ indicator: "bg-blueProgress" }}
              radius="none"
              className="absolute md:top-0 -top-4 w-full right-0 bg-black z-[60]"
            />
          </div>
        ))}
      <Divider orientation="horizontal" className="bg-border " />
      <div
        className={cn("w-full flex justify-between", isEditorFocus && "pb-3")}
      >
        <div className="w-full flex flex-col relative">
          {isEditorFocus && (
            <p className="text-gray ml-[52px]">
              Replying to{" "}
              <span className="text-blue">{singlePost?.users.username!}</span>
            </p>
          )}
          <div
            className={cn(
              isEditorFocus ? "w-full" : "w-[80%]",
              files.length > 0 && "mb-6"
            )}
          >
            <ReplyFormEditor
              editorValue={editorValue}
              isModalOpen={false}
              sessionImage={sessionImage}
              setCharLength={setCharLength}
              setEditorValue={setEditorValue}
              focusHandler={focusHandler}
            />
          </div>
          <div className="ml-[52px]">
            <PostFormAttachment
              files={files}
              isPending={isPending}
              isUploading={isUploading}
              handleRemove={handleFileRemove}
            />
          </div>
          <div className="flex justify-between items-center mt-4 relative -left-2">
            <input
              multiple
              type="file"
              className="hidden"
              ref={mediaRef}
              onChange={handleFileChange}
            />
            {isEditorFocus && (
              <div className="flex ml-[51px]">
                <Button
                  onClick={handleMedia}
                  size="sm"
                  isIconOnly
                  className="bg-transparent w-9 h-9 rounded-full hover:bg-blue/10"
                >
                  <Icons.media className="fill-blue w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  isIconOnly
                  className="bg-transparent w-9 h-9 rounded-full hover:bg-blue/10"
                >
                  <Icons.gif className="fill-blue w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  isIconOnly
                  className="bg-transparent w-9 h-9 rounded-full hover:bg-blue/10"
                >
                  <Icons.emoji className="fill-blue w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  isIconOnly
                  className="bg-transparent w-9 h-9 rounded-full hover:bg-blue/10"
                >
                  <Icons.tagLocation className="fill-blue w-5 h-5" />
                </Button>
              </div>
            )}
            <div className="flex gap-2 items-center h-full">
              {charLength > 0 && (
                <CircularProgress
                  size="sm"
                  value={charLength}
                  maxValue={280}
                  color="primary"
                  classNames={{
                    svgWrapper:
                      "w-[30px] h-[30px] flex justify-center items-center",
                    svg: "w-[20px] h-[20px]",
                  }}
                  aria-label="Post length"
                />
              )}
              <Button
                onClick={handleReplySubmit}
                size="sm"
                isDisabled={disabledByContent}
                className={cn(
                  "hover:bg-blue/90 w-fit px-4 rounded-full bg-blue text-sm leading-4 text-white font-bold -mr-2",
                  !isEditorFocus && "absolute bottom-5 right-0"
                )}
              >
                Reply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SinglePostReply;
