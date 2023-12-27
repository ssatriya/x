"use client";

import { Button } from "@nextui-org/react";

import Icons from "@/components/icons";

const TrendItem = () => {
  return (
    <div className="flex flex-col gap-0 hover:bg-text/5 py-2 cursor-pointer">
      <div className="flex items-center justify-between px-5">
        <p className="text-[13px] text-gray">Trending in Indonesia</p>
        <div className="relative flex items-center justify-center group">
          <Button
            isIconOnly
            size="sm"
            className="rounded-full bg-transparent hover:bg-blue/10 absolute right-[25%] group"
          >
            <Icons.more className="h-4 w-4 fill-gray group-hover:fill-blue" />
          </Button>
        </div>
      </div>
      <div className="px-5">
        <p className="font-bold">BCA Mobile</p>
        <p className="text-[13px] text-gray">1,673 posts</p>
      </div>
    </div>
  );
};
export default TrendItem;
