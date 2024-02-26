import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import IconSidebar from "@/components/main/layout/left/icon-left-sidebar";
import Sidebar from "@/components/main/layout/left/left-sidebar";
import RightSidebar from "@/components/main/layout/right/right-sidebar";
import Providers from "@/components/providers";
import { getAuthSession } from "@/lib/auth-options";
import db from "@/lib/db";
import { users } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

export default async function HomeLayoutGroup({
  children,
  photoModal,
}: {
  children: React.ReactNode;
  photoModal: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session?.user) {
    return redirect("/");
  }

  const [userLoggedIn] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id));

  if (!userLoggedIn) {
    return redirect("/");
  }

  return (
    <Providers>
      <div className="flex justify-center w-full">
        <Sidebar
          name={userLoggedIn.name!}
          image={userLoggedIn.image!}
          username={userLoggedIn.username!}
        />
        <IconSidebar
          name={userLoggedIn.name!}
          image={userLoggedIn.image!}
          username={userLoggedIn.username!}
        />
        <main className="min-h-screen flex gap-8 max-sm:w-full">
          <div
            className={cn(
              userLoggedIn.onboarding
                ? "border-x w-full h-full sm:w-[600px]"
                : "w-full sm:w-[600px]"
            )}
          >
            {!userLoggedIn.onboarding && <div className="w-[599px] block" />}
            {children}
            {photoModal}
          </div>
          {userLoggedIn.onboarding ? (
            <RightSidebar />
          ) : (
            <div className="hidden w-[348px] xl:flex xl:flex-col xl:mr-6" />
          )}
        </main>
      </div>
    </Providers>
  );
}
