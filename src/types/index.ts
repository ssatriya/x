import { SelectPost, SelectUser } from "@/lib/db/schema";

export type AttachmentType = {
  type: string;
  url: string;
  mime: string;
  name: string;
  extension: string;
  size: string;
  file: File;
};

export type PostUser = {
  post: SelectPost;
  user: SelectUser;
};
