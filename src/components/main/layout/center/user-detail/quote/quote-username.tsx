import { removeAtSymbol, truncateString } from "@/lib/utils";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import TooltipQuote from "./tooltip-user-quote";
import { PostUser } from "@/lib/db/schema";

type QuoteUsernameProps = {
  post: PostUser;
  align: "row" | "column";
  truncate?: boolean;
};

const QuoteUsername = ({ post, align, truncate }: QuoteUsernameProps) => {
  const usernameWithoutAt = removeAtSymbol(post.users.username!);
  const isMobile = useMediaQuery("(max-width: 450px)");

  if (align === "row") {
    return (
      <>
        <TooltipQuote post={post}>
          <Link
            href={`/${usernameWithoutAt}`}
            className="font-bold z-10 hover:underline focus-visible:ring-0 mobile:text-[15px] mobile:leading-5"
          >
            {truncate || isMobile
              ? truncateString(post.users.name!, 12)
              : post.users.name}
          </Link>
        </TooltipQuote>
        <TooltipQuote post={post}>
          <Link
            href={`/${usernameWithoutAt}`}
            className="text-gray focus-visible:ring-0 z-10 mobile:text-[15px] mobile:leading-5"
          >
            {truncate || isMobile
              ? truncateString(post.users.username!, 13)
              : post.users.username!}
          </Link>
        </TooltipQuote>
      </>
    );
  }

  if (align === "column") {
    return (
      <div className="flex flex-col">
        <TooltipQuote post={post}>
          <Link
            href={`/${usernameWithoutAt}`}
            className="font-bold z-10 hover:underline focus-visible:ring-0 mobile:text-[15px] mobile:leading-5"
          >
            {truncate || isMobile
              ? truncateString(post.users.name!, 12)
              : post.users.name}
          </Link>
        </TooltipQuote>
        <TooltipQuote post={post}>
          <Link
            href={`/${usernameWithoutAt}`}
            className="text-gray focus-visible:ring-0 z-10 mobile:text-[15px] mobile:leading-5"
          >
            {truncate || isMobile
              ? truncateString(post.users.username!, 13)
              : post.users.username!}
          </Link>
        </TooltipQuote>
      </div>
    );
  }
};
export default QuoteUsername;
