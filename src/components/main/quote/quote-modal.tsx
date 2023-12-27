"use react";

import * as React from "react";

import { useRouter } from "next/navigation";
import { AttachmentType } from "@/types";
import { DeltaStatic } from "quill";
import {
  Avatar,
  Button,
  CircularProgress,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
} from "@nextui-org/react";
import Icons from "@/components/icons";
import QuoteFormEditor from "./quote-form-editor";
import { ExtendedPost, SelectPost, SelectUser } from "@/lib/db/schema";
import { useMediaQuery } from "@mantine/hooks";
import { formatTimeToNow, truncateString } from "@/lib/utils";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useUploadThing } from "@/lib/uploadthing";
import PostAttachment from "../post-attachment";

type QuoteModalProps = {
  post: ExtendedPost;
  sessionId: SelectUser["id"];
  onOpenChangeQuoteModal: () => void;
  isOpenQuoteModal: boolean;
  sessionImage: SelectUser["image"];
};
const QuoteModal = ({
  post,
  sessionId,
  onOpenChangeQuoteModal,
  isOpenQuoteModal,
  sessionImage,
}: QuoteModalProps) => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 460px)");

  const mediaRef = React.useRef<React.ElementRef<"input">>(null);

  const [files, setFiles] = React.useState<AttachmentType[]>([]);
  const [content, setContent] = React.useState("");
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

  const handleRemoveImage = (url: string) => {
    setFiles((prevFiles) =>
      prevFiles.filter((attachment) => attachment.url !== url)
    );
  };

  const { mutate: createQuote, isPending } = useMutation({
    mutationKey: ["quoteMutation"],
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
      const { data } = await axios.post("/api/post/quote", payload);
      return data as string;
    },
    onSuccess: () => {
      setEditorValue(undefined);
      setFiles([]);
      // toast.success("Reply has been created.");
      onOpenChangeQuoteModal();
    },
  });

  const handleQuoteSubmit = async () => {
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
      createQuote({
        content: editorValue,
        imageUrl: "",
        postTargetId: post.id,
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
          createQuote({
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
      isOpen={isOpenQuoteModal}
      onOpenChange={() => {
        setEditorValue(undefined);
        onOpenChangeQuoteModal();
      }}
    >
      <ModalContent>
        {(onClose) => (
          <div className="relative">
            {isPending && (
              <Progress
                size="sm"
                aria-label="Posting..."
                isIndeterminate
                classNames={{
                  indicator: "bg-[#1D9BF0]",
                }}
                radius="none"
                className="absolute top-0 right-0 bg-black z-50"
              />
            )}
            <ModalHeader
              className="flex flex-col gap-1 px-4 h-[54px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex w-full justify-between">
                <Button
                  onClick={() => {
                    setEditorValue(undefined);
                    onClose();
                  }}
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
              <QuoteFormEditor
                isModalOpen={isOpenQuoteModal}
                setCharLength={setCharLength}
                setEditorValue={setEditorValue}
                editorValue={editorValue}
                sessionImage={sessionImage}
              />
              <div className="flex flex-col space-y-3">
                <div className="flex h-fit overflow-hidden flex-col justify-between pt-3 px-3 mt-2 border rounded-xl border-[#2f3336]z-10">
                  <div className="flex gap-2 items-center mb-1">
                    <Avatar
                      className="w-5 h-5"
                      showFallback
                      src={post.users.image ? post.users.image : undefined}
                      size="sm"
                    />

                    <div className="flex items-center gap-2">
                      <p className="font-bold">
                        {isMobile
                          ? truncateString(post.users.name!, 14)
                          : post.users.name}
                      </p>

                      <p className="text-[#555b61]">
                        {isMobile
                          ? truncateString(post.users.username!, 14)
                          : post.users.username}
                      </p>

                      <span className="text-gray">·</span>
                      <p className="text-[#555b61]">
                        {post.createdAt &&
                          formatTimeToNow(new Date(post.createdAt))}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-3">
                    <div>
                      {html.length > 0 && (
                        <div
                          className="pb-4"
                          dangerouslySetInnerHTML={{ __html: html }}
                        />
                      )}
                    </div>
                    {post?.imageUrl && (
                      <div className="flex justify-center">
                        {post.imageUrl && (
                          <PostAttachment
                            sessionImage={sessionImage}
                            post={post}
                            sessionId={sessionId}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
                    onClick={handleQuoteSubmit}
                    size="sm"
                    isDisabled={isPending || disabledByContent || isUploading}
                    className="hover:bg-blue/90 w-fit px-4 rounded-full bg-blue text-sm leading-4 text-white font-bold"
                  >
                    Reply
                  </Button>
                </div>
              </div>
            </ModalFooter>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};
export default QuoteModal;
