import Header from "@/components/main/header";
import ProfileInfo from "@/components/main/layout/center/profile/profile-info";
import ProfileTab from "@/components/main/layout/center/profile/profile-tab";
import { getAuthSession } from "@/lib/auth-options";
import db from "@/lib/db";
import { notFound, redirect } from "next/navigation";

type ProfilePageProps = {
  params: {
    username: string;
  };
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const session = await getAuthSession();
  const username = params.username;

  if (!session?.user) {
    return redirect("/");
  }

  const userByUsername = await db.query.users.findFirst({
    with: {
      followers: true,
      followings: true,
    },
    where: (users, { eq }) => eq(users.username, `@${username}`),
  });

  if (!userByUsername) {
    return notFound();
  }

  const postsCount = await db.query.posts.findMany({
    where: (posts, { eq }) => eq(posts.userId, userByUsername.id),
  });

  return (
    <>
      <Header
        title={userByUsername.name!}
        backButton={true}
        subtitle={`${postsCount.length} posts`}
      />
      <ProfileInfo
        userByUsername={userByUsername}
        loggedInUserId={session.user.id}
      />
      <ProfileTab
        userByUsername={userByUsername}
        sessionId={session.user.id}
        sessionImage={session.user.image!}
      />
    </>
  );
}
