"use client";

import Icons from "@/components/icons";
import AuthForm from "@/components/auth/auth-form";
import { footerLinks } from "@/constants/footer-links";

const AuthWrapper = () => {
  return (
    <>
      <div className="flex w-full flex-1 md:justify-evenly items-center max-md:p-5">
        <div className="hidden md:w-[55%] md:flex items-center justify-center">
          <div className="hidden md:block w-[400px]">
            <Icons.x className="fill-text" />
          </div>
        </div>
        <div className="w-full md:w-[45%]">
          <div className="mb-8 flex flex-col gap-12">
            <Icons.x className="fill-text h-11 w-11" />
            <h1 className="font-bold text-[40px] leading-[52px] md:text-6xl">
              Happening now
            </h1>
            <h2 className="font-bold md:text-4xl text-[23px] leading-7">
              Join today.
            </h2>
          </div>
          <AuthForm />
        </div>
      </div>
      <div className="flex flex-wrap md:flex gap-3 justify-center">
        {footerLinks.map((link: string) => (
          <div key={link} className="text-sm text-zinc-500">
            {link}
          </div>
        ))}
      </div>
    </>
  );
};
export default AuthWrapper;
