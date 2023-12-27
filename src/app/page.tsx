import { redirect } from "next/navigation";

import AuthWrapper from "@/components/auth/auth-wrapper";
import { getAuthSession } from "@/lib/auth-options";

export default async function Home() {
  const session = await getAuthSession();

  if (session?.user) {
    return redirect("/home");
  }

  return (
    <main className="px-4 pb-4 md:p-4 flex flex-col h-screen justify-between">
      <AuthWrapper />
    </main>
  );
}
