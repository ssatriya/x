"use client";

import Header from "@/components/main/header";
import { Tab, Tabs } from "@nextui-org/react";
import * as React from "react";
import PostFormEditor from "@/components/main/layout/center/home/post-form-editor";
import ForYouFeed from "@/components/main/layout/center/home/for-you-feed";
import { ExtendedPost } from "@/lib/db/schema";

type HomeTabProps = {
  username: string;
  image: string;
  sessionId: string;
  initialPosts: ExtendedPost[];
};
const HomeTab = ({
  username,
  image,
  sessionId,
  initialPosts,
}: HomeTabProps) => {
  return (
    <div className="flex w-full flex-col relative">
      <div className="hidden md:flex md:fixed md:w-[599px] bg-black/90 z-40 border-r backdrop-blur-sm">
        <Header title="Home" />
      </div>
      <Tabs
        aria-label="Options"
        variant="underlined"
        classNames={{
          tab: "h-[53px] w-full data-[hover=true]:opacity-100 data-[hover=true]:bg-hover group",
          tabList:
            "bg-black/90 w-full rounded-none p-0 gap-0 border-b md:fixed w-full md:w-[599px] md:mt-[53px] z-40 dark:bg-black/90 backdrop-blur-sm md:border-r",
          cursor: "bg-blue h-[4px] w-20 rounded-full",
          panel: "px-0 pb-0",
          tabContent:
            "text-[15px] group text-gray font-normal group-data-[selected=true]:font-bold",
        }}
      >
        <Tab key="for-you" title="For you">
          <div className="md:mt-[6.4rem] md:w-[599px]">
            <PostFormEditor image={image} username={username} />
            <ForYouFeed
              sessionId={sessionId}
              sessionImage={image}
              initialPosts={initialPosts}
            />
          </div>
        </Tab>
        <Tab key="following" title="Following">
          <div className="md:mt-[6.4rem] md:w-[599px]">
            <PostFormEditor image={image} username={username} />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};
export default HomeTab;
