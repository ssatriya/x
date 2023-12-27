import { PostUser } from "@/lib/db/schema";
import { Avatar, Button, Tooltip } from "@nextui-org/react";

type TooltipUserQuoteProps = {
  children: React.ReactNode;
  post: PostUser;
};

const TooltipUserQuote = ({ children, post }: TooltipUserQuoteProps) => {
  return (
    <Tooltip
      delay={1000}
      classNames={{
        base: "w-[280px] p-0 bg-black rounded-lg focus-visible:ring-0",
      }}
      placement="bottom"
      content={
        <div className="p-4 w-full shadow-normal rounded-lg">
          <div className="flex w-full justify-between items-start">
            <div className="flex flex-col gap-1">
              <Avatar showFallback src={post.users.image!} size="lg" />
            </div>
            {true ? null : false ? (
              <Button
                onMouseEnter={(e) => console.log(e)}
                // onClick={() => handleFollow()}
                className="fill-text w-24 rounded-full border-1 font-bold hover:text-red-500 hover:border-red-500 hover:bg-red-500/10 hover:content group"
                variant="bordered"
              >
                <span className="group-hover:hidden">Following</span>
                <span className="group-hover:block hidden text-red-500">
                  Unfollow
                </span>
              </Button>
            ) : (
              <Button
                // onClick={() => handleFollow()}
                className="border bg-text text-black rounded-full text-[15px] leading-5 font-bold hover:bg-text/90"
              >
                Follow
              </Button>
            )}
          </div>
          <div className="my-2">
            <div className="font-bold text-white">{post.users.name}</div>
            <p>{post.users.username}</p>
          </div>
          <div className="text-white text-sm">{post.users.bio}</div>
          <div className="flex w-[80%] justify-between mt-4">
            <div className="text-white">
              {/* <span className=" font-bold">{followingsAmt.length}</span>{" "} */}
              <span className="font-normal">Following</span>
            </div>

            <div className="text-white">
              {/* <span className=" font-bold">{followersAmt.length}</span>{" "} */}
              <span className="font-normal">Followers</span>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </Tooltip>
  );
};
export default TooltipUserQuote;
