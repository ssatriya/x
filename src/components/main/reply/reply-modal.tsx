"use client";

import * as React from "react";
import {
  Button,
  CircularProgress,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
} from "@nextui-org/react";
import { DeltaStatic } from "quill";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Icons from "@/components/icons";
import { ExtendedPost, SelectPost, SelectUser } from "@/lib/db/schema";
import ReplyTarget from "@/components/main/reply/reply-target";
import ReplyFormEditor from "@/components/main/reply/reply-form-editor";
import { AttachmentType } from "@/types";
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import PostFormAttachment from "@/components/main/post-form-attachment";

type ReplyModalProps = {
  onOpenChangeReplyModal: () => void;
  isOpenReplyModal: boolean;
  post: ExtendedPost;
  sessionImage: SelectUser["image"];
  sessionId: SelectUser["id"];
};
const ReplyModal = ({
  onOpenChangeReplyModal,
  isOpenReplyModal,
  post,
  sessionId,
  sessionImage,
}: ReplyModalProps) => {
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
      queryClient.invalidateQueries({ queryKey: ["replyData", post.id] });
      setEditorValue(undefined);
      setFiles([]);
      onOpenChangeReplyModal();
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
        postTargetId: post.id,
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
            postTargetId: post.id,
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

  return (
    <Modal
      placement="top"
      hideCloseButton
      disableAnimation
      size="2xl"
      classNames={{
        base: "bg-black w-full max-sm:h-full w-[600px] lg:h-fit rounded-xl px-0",
        backdrop: "bg-backdrop",
      }}
      backdrop="opaque"
      isOpen={isOpenReplyModal}
      onOpenChange={onOpenChangeReplyModal}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <div className="relative">
              {isPending ||
                (isUploading && (
                  <Progress
                    size="sm"
                    aria-label="Posting..."
                    isIndeterminate
                    classNames={{
                      indicator: "bg-blueProgress",
                      track: "bg-transparent",
                    }}
                    radius="none"
                    className="absolute md:top-0 -top-4 w-full right-0 bg-black z-60"
                  />
                ))}
            </div>
            <ModalHeader
              className="flex flex-col gap-1 px-4 pt-2 h-[54px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex w-full justify-between">
                <Button
                  onClick={onClose}
                  isIconOnly
                  size="sm"
                  className="hover:bg-blue/10 w-fit rounded-full bg-transparent"
                >
                  <Icons.close className="fill-text h-5 w-5" />
                </Button>
                <Button
                  size="sm"
                  className="hover:bg-blue/10 w-fit px-4 rounded-full bg-transparent text-sm leading-4 text-blue font-bold"
                >
                  Draft
                </Button>
              </div>
            </ModalHeader>
            <ModalBody onClick={(e) => e.stopPropagation()}>
              <div className="pt-4">
                <ReplyTarget post={post} />
                <ReplyFormEditor
                  editorValue={editorValue}
                  isModalOpen={isOpenReplyModal}
                  sessionImage={sessionImage}
                  setCharLength={setCharLength}
                  setEditorValue={setEditorValue}
                  focusHandler={() => {}}
                />
              </div>
              <div className="pl-[53px]">
                <PostFormAttachment
                  files={files}
                  isPending={isPending}
                  isUploading={isUploading}
                  handleRemove={handleFileRemove}
                />
              </div>
              {/* {isMobile && <div className="h-full" {...pressProps} />} */}
            </ModalBody>
            <ModalFooter className="pl-4">
              <div className="w-full flex justify-between items-center">
                <input
                  multiple
                  type="file"
                  className="hidden"
                  ref={mediaRef}
                  onChange={handleFileChange}
                />
                <div className="flex">
                  <Button
                    disabled={files.length > 3}
                    onClick={handleMedia}
                    size="sm"
                    isIconOnly
                    className={
                      "bg-transparent w-9 h-9 rounded-full hover:bg-blue/10"
                    }
                  >
                    <Icons.media className={cn("fill-blue w-5 h-5")} />
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
                    <Icons.poll className="fill-blue w-5 h-5" />
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
                    <Icons.schedule className="fill-blue w-5 h-5" />
                  </Button>
                  <Button
                    size="sm"
                    isIconOnly
                    className="bg-transparent w-9 h-9 rounded-full hover:bg-blue/10"
                  >
                    <Icons.tagLocation className="fill-blue w-5 h-5" />
                  </Button>
                </div>
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
                      aria-label="Reply length"
                    />
                  )}
                  <Button
                    onClick={handleReplySubmit}
                    size="sm"
                    isDisabled={isPending || disabledByContent || isUploading}
                    className="hover:bg-blue/90 w-fit px-4 rounded-full bg-blue text-sm leading-4 text-white font-bold"
                  >
                    Reply
                  </Button>
                </div>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default ReplyModal;
