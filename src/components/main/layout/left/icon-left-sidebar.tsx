"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Icons from "@/components/icons";
import { removeAtSymbol } from "@/lib/utils";

type IconLeftSidebarProps = {
  username: string;
  image: string;
  name: string;
};

const IconLeftSidebar = ({ username, image, name }: IconLeftSidebarProps) => {
  const path = usePathname();

  const cleanUsername = removeAtSymbol(username);

  return (
    <nav className="px-2 pt-1 w-20 md:flex md:justify-center xl:hidden hidden">
      <div className="gap-2 flex flex-col fixed">
        <Link
          href="/home"
          className="mb-2 h-[50px] w-[50px] rounded-full flex items-center justify-center hover:bg-hover p-3"
        >
          <Icons.x className="w-8 h-8 fill-neutral-100" />
        </Link>

        <Link href="/home" className="hover:bg-hover w-fit p-3 rounded-full">
          <div className="flex items-center justify-center">
            {path === "/home" ? (
              <Icons.home className="w-[27px] h-[27px] stroke-neutral-100 fill-neutral-100" />
            ) : (
              <Icons.home
                strokeWidth={2}
                className="w-[27px] h-[27px] stroke-neutral-100 "
              />
            )}
          </div>
        </Link>
        <Link href="/#" className="hover:bg-hover w-fit p-3 rounded-full">
          <div className="flex items-center justify-center">
            <Icons.explore className="w-[27px] h-[27px] fill-neutral-100" />
          </div>
        </Link>
        <Link href="/" className="hover:bg-hover w-fit p-3 rounded-full">
          <div className="flex items-center justify-center">
            <Icons.notifications className="w-[27px] h-[27px] fill-neutral-100" />
          </div>
        </Link>
        <Link href="/" className="hover:bg-hover w-fit p-3 rounded-full">
          <div className="flex items-center justify-center">
            <Icons.messages className="w-[27px] h-[27px] fill-neutral-100" />
          </div>
        </Link>
        <Link href="/" className="hover:bg-hover w-fit p-3 rounded-full">
          <div className="flex items-center justify-center">
            <Icons.lists className="w-[27px] h-[27px] fill-neutral-100" />
          </div>
        </Link>
        <Link href="/" className="hover:bg-hover w-fit p-3 rounded-full">
          <div className="flex items-center justify-center">
            <Icons.communities className="w-[27px] h-[27px] fill-neutral-100" />
          </div>
        </Link>
        <Link href="/" className="hover:bg-hover w-fit p-3 rounded-full">
          <div className="flex items-center justify-center">
            <Icons.verified className="w-[27px] h-[27px] fill-neutral-100" />
          </div>
        </Link>
        <Link
          href={`/${cleanUsername}`}
          className="hover:bg-hover w-fit p-3 rounded-full"
        >
          <div className="flex items-center justify-center">
            {path === `/${cleanUsername}` ? (
              <Icons.profile className="w-[27px] h-[27px] fill-neutral-100" />
            ) : (
              <Icons.profile
                strokeWidth={2}
                className="w-[27px] h-[27px] stroke-neutral-100"
              />
            )}
          </div>
        </Link>
        <Link href="/" className="hover:bg-hover w-fit p-3 rounded-full">
          <div className="flex items-center justify-center">
            <Icons.moreCircle className="w-[27px] h-[27px] fill-neutral-100" />
          </div>
        </Link>
        <a
          href="https://github.com/ssatriya/x-clone"
          target="__blank"
          className="hover:bg-hover w-fit p-3 rounded-full"
        >
          <div className="flex items-center justify-center">
            <Icons.github className="w-[27px] h-[27px] fill-neutral-100" />
          </div>
        </a>
        <Button
          isIconOnly
          className="bg-blue hover:bg-blue/90 font-bold rounded-full h-[50px] w-[50px] text-lg mt-4"
        >
          <div className="flex items-center justify-center">
            <Icons.compose className="w-[27px] h-[27px] fill-neutral-100" />
          </div>
        </Button>
      </div>
      {/* === */}
      <div className="fixed w-[275px] flex justify-center bottom-4">
        <Dropdown
          showArrow
          classNames={{
            base: "px-0 w-[300px] bg-black shadow-normal",
          }}
        >
          <DropdownTrigger>
            <Button
              size="sm"
              className="bg-black hover:bg-text/10 h-[65px] w-[65px] font-bold rounded-full p-3 text-lg mt-4"
            >
              <Image
                src={image}
                alt={username}
                height={40}
                width={40}
                className="rounded-full"
              />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="User menu" className="px-0 py-3">
            <DropdownItem className="rounded-none py-3 px-4 data-[hover=true]:bg-hover">
              <p className="font-bold text-[15px] leading-5">
                Add an existing account
              </p>
            </DropdownItem>
            <DropdownItem
              onClick={() => signOut()}
              className="rounded-none py-3 px-4 data-[hover=true]:bg-hover"
            >
              <p className="font-bold text-[15px] leading-5">
                Logged out {username}
              </p>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      {/* ==== */}
    </nav>
  );
};
export default IconLeftSidebar;
