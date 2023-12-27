"use client";

import * as React from "react";

import dynamic from "next/dynamic";
import { Avatar, Button } from "@nextui-org/react";
import { SelectUser } from "@/lib/db/schema";
import Icons from "@/components/icons";
import { DeltaStatic } from "quill";

export const Editor = dynamic(() => import("@/components/main/quill-editor"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

type QuoteFormEditorProps = {
  sessionImage: SelectUser["image"];
  editorValue: DeltaStatic | undefined;
  setCharLength: (value: number) => void;
  setEditorValue: (value: DeltaStatic) => void;
  isModalOpen: boolean;
};

const QuoteFormEditor = ({
  sessionImage,
  editorValue,
  setCharLength,
  setEditorValue,
  isModalOpen,
}: QuoteFormEditorProps) => {
  return (
    <div className="pt-4 w-full h-full">
      <div className="flex gap-3">
        <div>
          <Avatar src={sessionImage ? sessionImage : undefined} />
        </div>
        <div className="w-full h-24">
          <Button
            variant="bordered"
            size="sm"
            className="border border-gray hover:bg-blue/10 flex h-6 w-fit rounded-full px-3 text-sm leading-4 text-blue font-bold mb-4"
          >
            Everyone
            <Icons.arrowDown className="fill-blue h-[15px] w-[15px]" />
          </Button>
          <Editor
            isModalOpen={isModalOpen}
            editorValue={editorValue}
            setCharLength={setCharLength}
            setEditorValue={setEditorValue}
            placeholder="Post your reply"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
export default QuoteFormEditor;
