import { removeAtSymbol, truncateString } from "@/lib/utils";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import TooltipUserReply from "./tooltip-user-reply";
import { ExtendedReply } from "@/lib/db/schema";

type ReplyUsernameProps = {
  post: ExtendedReply;
  align: "row" | "column";
  truncate?: boolean;
};

const ReplyUsername = ({ post, align, truncate }: ReplyUsernameProps) => {
  const usernameWithoutAt = removeAtSymbol(post.users.username!);
  const isMobile = useMediaQuery("(max-width: 450px)");

  if (align === "row") {
    return (
      <>
        <TooltipUserReply post={post}>
          <Link
            href={`/${usernameWithoutAt}`}
            className="font-bold z-10 hover:underline focus-visible:ring-0 mobile:text-[15px] mobile:leading-5"
          >
            {truncate || isMobile
              ? truncateString(post.users.name!, 12)
              : post.users.name}
          </Link>
        </TooltipUserReply>
        <TooltipUserReply post={post}>
          <Link
            href={`/${usernameWithoutAt}`}
            className="text-gray focus-visible:ring-0 z-10 mobile:text-[15px] mobile:leading-5"
          >
            {truncate || isMobile
              ? truncateString(post.users.username!, 13)
              : post.users.username!}
          </Link>
        </TooltipUserReply>
      </>
    );
  }

  if (align === "column") {
    return (
      <div className="flex flex-col">
        <TooltipUserReply post={post}>
          <Link
            href={`/${usernameWithoutAt}`}
            className="font-bold z-10 hover:underline focus-visible:ring-0 mobile:text-[15px] mobile:leading-5"
          >
            {truncate || isMobile
              ? truncateString(post.users.name!, 12)
              : post.users.name}
          </Link>
        </TooltipUserReply>
        <TooltipUserReply post={post}>
          <Link
            href={`/${usernameWithoutAt}`}
            className="text-gray focus-visible:ring-0 z-10 mobile:text-[15px] mobile:leading-5"
          >
            {truncate || isMobile
              ? truncateString(post.users.username!, 13)
              : post.users.username!}
          </Link>
        </TooltipUserReply>
      </div>
    );
  }
};
export default ReplyUsername;
