import { removeAtSymbol, truncateString } from "@/lib/utils";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import TooltipUser from "./tooltip-user";
import { ExtendedPost } from "@/lib/db/schema";
import { redirect } from "next/navigation";

type PostUsernameProps = {
  post: ExtendedPost;
  align: "row" | "column";
  truncate?: boolean;
};

const PostUsername = ({ post, align, truncate }: PostUsernameProps) => {
  const isMobile = useMediaQuery("(max-width: 450px)");

  const usernameWithoutAt = removeAtSymbol(post.users.username!);

  if (align === "row") {
    return (
      <>
        <TooltipUser post={post}>
          <Link
            href={`/${usernameWithoutAt}`}
            className="font-bold z-10 hover:underline focus-visible:ring-0 mobile:text-[15px] mobile:leading-5"
          >
            {truncate || isMobile
              ? truncateString(post.users.name!, 12)
              : post.users.name}
          </Link>
        </TooltipUser>
        <TooltipUser post={post}>
          <Link
            href={`/${usernameWithoutAt}`}
            className="text-gray focus-visible:ring-0 z-10 mobile:text-[15px] mobile:leading-5"
          >
            {truncate || isMobile
              ? truncateString(post.users.username!, 13)
              : post.users.username!}
          </Link>
        </TooltipUser>
      </>
    );
  }

  if (align === "column") {
    return (
      <div className="flex flex-col">
        <TooltipUser post={post}>
          <Link
            href={`/${usernameWithoutAt}`}
            className="font-bold z-10 hover:underline focus-visible:ring-0 mobile:text-[15px] mobile:leading-5"
          >
            {truncate || isMobile
              ? truncateString(post.users.name!, 12)
              : post.users.name}
          </Link>
        </TooltipUser>
        <TooltipUser post={post}>
          <Link
            href={`/${usernameWithoutAt}`}
            className="text-gray focus-visible:ring-0 z-10 mobile:text-[15px] mobile:leading-5"
          >
            {truncate || isMobile
              ? truncateString(post.users.username!, 13)
              : post.users.username!}
          </Link>
        </TooltipUser>
      </div>
    );
  }
};
export default PostUsername;
