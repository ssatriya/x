"use client";

import { SelectUser, UsersProfile } from "@/lib/db/schema";
import { Tab, Tabs } from "@nextui-org/react";
import AllUserPost from "./post/all-user-post";
import { ReplyWithRepliedTo as ReplyWithRepliedToType } from "@/lib/db/schema";

type ProfileTabProps = {
  userByUsername: UsersProfile;
  sessionId: SelectUser["id"];
  sessionImage: SelectUser["image"];
  initialData: any;
};

const ProfileTab = ({
  userByUsername,
  sessionId,
  sessionImage,
  initialData,
}: ProfileTabProps) => {
  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        variant="underlined"
        classNames={{
          tab: "h-[53px] w-full data-[hover=true]:opacity-100 data-[hover=true]:bg-hover group",
          tabList: "bg-black/90 w-full rounded-none p-0 gap-0 border-b",
          cursor: "bg-blue h-[4px] w-20 rounded-full",
          panel: "px-0 pb-0 py-0",
          tabContent:
            "text-[15px] group text-gray font-normal group-data-[selected=true]:font-bold",
        }}
      >
        <Tab key="posts" title="Posts">
          <AllUserPost
            userByUsername={userByUsername}
            sessionId={sessionId}
            sessionImage={sessionImage}
            initialData={initialData}
          />
        </Tab>
        <Tab key="replies" title="Replies"></Tab>
        {userByUsername.id === sessionId && (
          <Tab key="highlights" title="Highlights"></Tab>
        )}
        <Tab key="media" title="Media"></Tab>
        <Tab key="likes" title="Likes">
          {/* <AllUserLikes
        userByUsername={userByUsername}
        currentUser={currentUser}
      /> */}
        </Tab>
      </Tabs>
    </div>
  );
};
export default ProfileTab;
