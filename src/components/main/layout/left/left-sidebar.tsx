"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import Image from "next/image";

import Icons from "@/components/icons";
import LeftSidebarItem from "@/components/main/layout/left/left-sidebar-item";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { removeAtSymbol } from "@/lib/utils";

type LeftSidebarProps = {
  image: string;
  username: string;
  name: string;
};

const LeftSidebar = ({ image, username, name }: LeftSidebarProps) => {
  const router = useRouter();

  const usernameWithoutAt = removeAtSymbol(username);

  const routes = [
    {
      label: "Home",
      icon: "home",
      href: `/home`,
      disabled: false,
    },
    {
      label: "Explore",
      icon: "explore",
      href: "/explore",
      disabled: true,
    },
    {
      label: "Notifications",
      icon: "notifications",
      href: "/notifications",
      disabled: true,
    },
    {
      label: "Messages",
      icon: "messages",
      href: "/messages",
      disabled: true,
    },
    {
      label: "Lists",
      icon: "lists",
      href: "/lists",
      disabled: true,
    },
    {
      label: "Communities",
      icon: "communities",
      href: "/communities",
      disabled: true,
    },
    {
      label: "Verified",
      icon: "verified",
      href: "/verified",
      disabled: true,
    },
    {
      label: "Profile",
      icon: "profile",
      href: `/${usernameWithoutAt}`,
      disabled: false,
    },
    {
      label: "More",
      icon: "moreCircle",
      href: "/more",
      disabled: true,
    },
  ];

  return (
    <nav className="px-2 pt-1 w-[275px] hidden xl:block min-h-screen">
      <div className="flex flex-col justify-between fixed h-full">
        <div className="gap-2 flex flex-col">
          <div
            role="button"
            onClick={() => router.push("/home")}
            className="mb-2 h-[50px] w-[50px] rounded-full flex items-center justify-center"
          >
            <Icons.x className="w-8 h-8 fill-neutral-100" />
          </div>
          {routes.map((link) => (
            <LeftSidebarItem
              key={link.label}
              label={link.label}
              icon={link.icon}
              href={link.href}
              disabled={link.disabled}
            />
          ))}
          <a
            href="https://github.com/ssatriya/x"
            target="__blank"
            className="hover:bg-neutral-100/90 w-fit p-3 rounded-full bg-neutral-100"
          >
            <div className="flex items-center justify-center">
              <Icons.github className="w-[27px] h-[27px] fill-neutral-800" />
              <div className="text-xl pr-4 pl-5 text-neutral-800">
                Repository
              </div>
            </div>
          </a>
          <Button className="bg-blue hover:bg-blue/90 font-bold rounded-full py-6 text-lg mt-4">
            Post
          </Button>
        </div>
      </div>
      <div className="fixed w-[275px] pr-4 bottom-4">
        <Dropdown
          showArrow
          classNames={{
            base: "px-0 w-[300px] bg-black shadow-normal",
          }}
        >
          <DropdownTrigger>
            <Button className="bg-black w-full hover:bg-text/10 h-[65px] font-bold rounded-full p-3 text-lg mt-4 flex justify-between items-center">
              <div className="flex gap-2">
                <Image
                  src={image}
                  alt={username}
                  height={40}
                  width={40}
                  className="rounded-full"
                />
                <div className="flex flex-col items-start">
                  <p className="text-[15px] font-bold leading-5">{name}</p>
                  <p className="text-[15px] leading-5 text-gray">{username}</p>
                </div>
              </div>
              <Icons.more className="fill-text w-5 h-5" />
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
    </nav>
  );
};
export default LeftSidebar;
