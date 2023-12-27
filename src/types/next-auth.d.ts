import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

import { SelectUser } from "./db/schema";

declare module "next-auth/jwt" {
  interface JWT {
    username?: string | null;
    id: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      username?: string | null;
      id: string;
    };
  }
}
