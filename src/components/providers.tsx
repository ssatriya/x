"use client";

import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        <SessionProvider>{children}</SessionProvider>
      </NextUIProvider>
    </QueryClientProvider>
  );
};
export default Providers;
