"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/navigation";
import { DeltaStatic } from "quill";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AttachmentType } from "@/types/index";
import { useUploadThing } from "@/lib/uploadthing";
import { Button, CircularProgress, Divider, Progress } from "@nextui-org/react";
import Icons from "@/components/icons";
import { cn } from "@/lib/utils";
import Image from "next/image";
import PostFormAttachment from "@/components/main/post-form-attachment";

const Editor = dynamic(() => import("@/components/main/quill-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-9 mt-2">
      <p className="text-[20px] text-[#808080] font-sans">Whats happening?</p>
    </div>
  ),
});

type PostFormEditorProps = {
  username: string;
  image: string;
};

const PostFormEditor = ({ username, image }: PostFormEditorProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mediaRef = React.useRef<React.ElementRef<"input">>(null);

  const [isFocus, setIsFocus] = React.useState<boolean>(false);
  const [files, setFiles] = React.useState<AttachmentType[]>([]);
  const [content, setContent] = React.useState("");
  const [editorValue, setEditorValue] = React.useState<
    DeltaStatic | undefined
  >();
  const [charLength, setCharLength] = React.useState(0);

  const { mutate: createPost, isPending } = useMutation({
    mutationKey: ["post"],
    mutationFn: async ({
      content,
      imageUrl,
    }: {
      content: any;
      imageUrl: string;
    }) => {
      const payload = {
        content,
        imageUrl,
      };

      const { data } = await axios.post("/api/post", payload);

      return data;
    },
    onError: () => {},
    onSuccess: () => {
      setContent("");
      router.refresh();
      setIsFocus(false);
      queryClient.invalidateQueries({ queryKey: ["for-you-feed"] });
    },
  });

  const focusHandler = () => {
    setIsFocus(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newAttachments: AttachmentType[] = Array.from(
        e.target.files,
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

      setFiles((prevFiles) => prevFiles.concat(newAttachments));
    }
  };

  const handleMedia = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isFocus) {
      focusHandler();
      return;
    }
    if (mediaRef && mediaRef.current) {
      mediaRef.current.click();
    }
  };

  const handleFileRemove = (url: string) => {
    setFiles((prevFiles) =>
      prevFiles.filter((attachment) => attachment.url !== url)
    );
  };

  const handlePostSubmit = async () => {
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
      createPost({ content: editorValue, imageUrl: "" });
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
          createPost({ content: editorValue, imageUrl: fileUrl.toString() });
        }
      }

      setFiles([]);
      setEditorValue(undefined);
    },
    onUploadError: (error) => {},
    onUploadBegin: () => {},
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
    <div className="w-full relative">
      {isPending ||
        (isUploading && (
          <Progress
            size="sm"
            aria-label="Posting..."
            isIndeterminate
            radius="none"
            classNames={{ track: "bg-transparent" }}
            className="absolute md:-top-3 -top-4 right-0 z-50"
          />
        ))}
      <div className="flex relative justify-between py-2 px-4 border-b">
        <div
          className={cn(
            isPending || isUploading
              ? "absolute inset-0 bg-black/60 z-50 border-r"
              : "hidden"
          )}
        />
        <Image
          src={image}
          height={40}
          width={40}
          alt={username}
          priority
          className="rounded-full h-10 w-10"
        />
        <div className="w-full flex flex-col">
          <div className="ml-3">
            <div className="w-full">
              <Editor
                focusHandler={focusHandler}
                editorValue={editorValue}
                setCharLength={setCharLength}
                setEditorValue={setEditorValue}
                className="max-w-4xl mx-auto relative py-2"
                placeholder="Whats happening?"
                isFocus={isFocus}
              />
            </div>
            <PostFormAttachment
              files={files}
              isPending={isPending}
              isUploading={isUploading}
              handleRemove={handleFileRemove}
            />
          </div>
          {isFocus && !isUploading && !isPending && (
            <>
              <div className="flex ml-3 flex-col relative mt-2">
                <Button
                  variant="flat"
                  size="sm"
                  className="mb-[1px] 4absolute -left-3 flex items-center gap-2 w-fit rounded-full h-6 bg-transparent hover:bg-blue/10"
                >
                  <Icons.globe className="fill-blue w-5 h-5" />
                  <p className="text-sm font-semibold text-blue">
                    Everyone can reply
                  </p>
                </Button>
              </div>
              <div className="border-b border-[#2f3336] mt-4" />
            </>
          )}
          <div className="flex justify-between items-center mt-4">
            <input
              multiple
              type="file"
              className="hidden"
              ref={mediaRef}
              onChange={handleFileChange}
            />
            {!isUploading && !isPending && (
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
            )}
            <div className="flex gap-2 items-center h-full">
              {charLength > 0 && !isUploading && !isPending && (
                <>
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
                  <div className="px-[2px] h-full py-[2px]">
                    <Divider orientation="vertical" className="w-[1px]" />
                  </div>
                  {/* <Button
              size="sm"
              isIconOnly
              className="rounded-full data-[hover=true]:bg-blue/10 h-[30px] w-[30px] border bg-black"
            >
              <Icons.plusIcon className="h-4 w-4 fill-blue p-0" />
            </Button> */}
                </>
              )}
              {!isUploading && !isPending && (
                <Button
                  size="sm"
                  isDisabled={isPending || disabledByContent || isUploading}
                  onClick={handlePostSubmit}
                  className="bg-blue hover:bg-blue/90 font-bold rounded-full"
                >
                  Post
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PostFormEditor;
