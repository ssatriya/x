"use client";

import Icons from "@/components/icons";
import { SelectUser } from "@/lib/db/schema";
import { Avatar, Button } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { DeltaStatic } from "quill";

export const Editor = dynamic(() => import("@/components/main/quill-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-9 mt-2">
      <p className="text-[20px] text-[#808080] font-sans">Post your reply</p>
    </div>
  ),
});

type ReplyFormEditorProps = {
  sessionImage: SelectUser["image"];
  editorValue: DeltaStatic | undefined;
  setCharLength: (value: number) => void;
  setEditorValue: (value: DeltaStatic) => void;
  isModalOpen: boolean;
  focusHandler: () => void;
};

const ReplyFormEditor = ({
  sessionImage,
  editorValue,
  setCharLength,
  setEditorValue,
  isModalOpen,
  focusHandler,
}: ReplyFormEditorProps) => {
  return (
    <div className="pt-4 w-full h-full">
      <div className="flex gap-3">
        <div>
          <Avatar src={sessionImage ? sessionImage : undefined} />
        </div>
        <div className="w-full h-auto overflow-hidden self-center">
          <Editor
            isModalOpen={isModalOpen}
            editorValue={editorValue}
            setCharLength={setCharLength}
            setEditorValue={setEditorValue}
            placeholder="Post your reply"
            className=""
            focusHandler={focusHandler}
          />
        </div>
      </div>
    </div>
  );
};
export default ReplyFormEditor;
