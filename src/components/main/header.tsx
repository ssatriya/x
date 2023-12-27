"use client";

import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import Icons from "@/components/icons";

import { usePreviousPath } from "@/hooks/usePreviousPath";

type HeaderProps = {
  title: string;
  subtitle?: String;
  backButton?: boolean;
};
const Header = ({ title, subtitle, backButton }: HeaderProps) => {
  const router = useRouter();

  const previousPath = usePreviousPath((state) => state.previousPath);

  const handleBack = () => {
    // if (previousPath) {
    //   router.push(previousPath, { scroll: false });
    // } else {
    router.push("/home", { scroll: false });
    // }
  };

  return (
    <div className="h-[53px] w-full items-center px-4 flex">
      {backButton && (
        <Button
          onClick={handleBack}
          isIconOnly
          size="sm"
          className="bg-black rounded-full hover:bg-hover mr-9"
        >
          <Icons.arrowLeft className="fill-text h-5 w-5 " />
        </Button>
      )}
      <div className="flex flex-col">
        <div className="font-bold text-xl leading-6">{title}</div>
        <div className="text-[13px] text-gray leading-4">{subtitle}</div>
      </div>
    </div>
  );
};
export default Header;
