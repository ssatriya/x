"use client";

import Image from "next/image";

import Icons from "@/components/icons";

type MobileHeaderProps = {
  image: string;
  name: string;
};
const MobileHeader = ({ image, name }: MobileHeaderProps) => {
  return (
    <div className="relative md:hidden">
      <div className="h-[53px] items-center px-4 flex">
        <Image
          src={image}
          height={32}
          width={32}
          alt={name}
          className="rounded-full"
          priority
        />
      </div>
      <div className="flex w-full items-center justify-center absolute top-4">
        <Icons.x className="w-6 h-full fill-text" />
      </div>
    </div>
  );
};
export default MobileHeader;
