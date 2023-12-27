"use client";

import Icons from "@/components/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type LeftSidebarItemProps = {
  label: string;
  icon: string;
  href: string;
  disabled: boolean;
};

const LeftSidebarItem = ({
  label,
  icon,
  href,
  disabled,
}: LeftSidebarItemProps) => {
  const path = usePathname();

  const Icon = Icons[icon];

  return (
    <Link
      href={href}
      className={cn(
        "hover:bg-hover w-fit p-3 rounded-full",
        disabled && "cursor-not-allowed text-neutral-400"
      )}
    >
      <div className="flex items-center justify-center">
        {path === href ? (
          <Icon
            className={cn(
              "w-[27px] h-[27px] fill-neutral-100",
              label === "Profile" || (label === "Home" && "stroke-neutral-100")
            )}
          />
        ) : (
          <Icon
            strokeWidth={2}
            className={cn(
              "w-[27px] h-[27px]",
              label === "Home" || label === "Profile"
                ? "stroke-neutral-100"
                : "fill-neutral-100",
              disabled && "fill-neutral-400"
            )}
          />
        )}
        <div
          className={cn(
            path === href ? "font-bold" : "font-normal",
            "text-xl pr-4 pl-5"
          )}
        >
          {label}
        </div>
      </div>
    </Link>
  );
};
export default LeftSidebarItem;
