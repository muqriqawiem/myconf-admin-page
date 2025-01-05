"use client";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

//create a queryclient instance
const queryClient = new QueryClient();

export default function AuthProvider({
  children
}:{children:React.ReactNode}) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
      {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}