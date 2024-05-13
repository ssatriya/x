import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "@/lib/db";
import { customAlphabet } from "nanoid";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

const alphabet = "0123456789";
const nanoid = customAlphabet(alphabet, 5);

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          username: `${profile.name.replace(/\s/g, "")}`.padEnd(15, nanoid()),
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.name = token.name;
      }

      return session;
    },
    async jwt({ token, user }) {
      let userDB;
      if (token && token.email && token.name) {
        [userDB] = await db
          .select()
          .from(users)
          .where(eq(users.email, token.email));

        const createUsername = `${token.name.replace(/\s/g, "")}`.padEnd(
          15,
          nanoid()
        );

        if (!userDB.username) {
          await db
            .update(users)
            .set({ username: createUsername })
            .where(eq(users.email, token.email!));
        }
      }

      return { ...token, ...user, username: userDB?.username };
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
