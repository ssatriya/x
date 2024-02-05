import Header from "@/components/main/header";
import HomeTab from "@/components/main/layout/center/home/home-tab";
import MobileHeader from "@/components/main/mobile-header";
import Onboarding from "@/components/main/modal/onboarding/onboarding";
import { getAuthSession } from "@/lib/auth-options";
import db from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { setTimeout } from "timers/promises";

export const dynamic = "force-dynamic";
export default async function HomePage() {
  const session = await getAuthSession();

  if (!session?.user) {
    return redirect("/");
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id));

  if (!user[0]) {
    return redirect("/");
  }

  if (!user[0].onboarding) {
    return (
      <>
        <Header title="Home" />
        <Onboarding username={user[0].username!} userId={user[0].id} />
      </>
    );
  }

  await setTimeout(1000);

  // const initialPosts = await db.query.posts.findMany({
  //   where: (posts, { or, eq }) =>
  //     or(eq(posts.postType, "POST"), eq(posts.postType, "QUOTE")),
  //   with: {
  //     likes: true,
  //     users: true,
  //     reposts: true,
  //     replys: true,
  //     quoted: {
  //       with: {
  //         post: {
  //           with: {
  //             users: true,
  //           },
  //         },
  //       },
  //     },
  //   },
  //   orderBy: (posts, { desc }) => desc(posts.createdAt),
  //   offset: 1 * 10,
  //   limit: 10,
  // });

  return (
    <>
      <MobileHeader image={session.user.image!} name={session.user.name!} />
      <HomeTab
        username={session.user.username!}
        image={session.user.image!}
        sessionId={session.user.id}
      />
    </>
  );
}
