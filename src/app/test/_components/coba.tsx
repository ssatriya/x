"use client";

import { ExtendedPost, ReplyWithRepliedTo } from "@/lib/db/schema";
import { InferSelectModel } from "drizzle-orm";

const Coba = ({ post }: { post: ReplyWithRepliedTo[] }) => {
  console.log(post);
  return <div>Coba</div>;
};
export default Coba;
