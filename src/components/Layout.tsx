"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePathname } from "next/navigation";

type LayoutProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

export default function Layout({ children }: LayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOrRegisterPage, setIsLoginOrRegisterPage] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const isLoginOrRegister = pathname === "/login" || pathname === "/register";
    setIsLoginOrRegisterPage(isLoginOrRegister);
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative h-screen w-screen">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('/images/patterns/flower.webp')] bg-cover bg-no-repeat opacity-80" />
          <div className="absolute inset-0 bg-white opacity-70" />
        </div>
        
        <div className="flex h-full w-full relative z-10">
          {!isLoginOrRegisterPage && <Sidebar setIsOpen={setIsOpen} />}

          <div
            className={`flex-1 flex flex-col transition-all duration-300 ${isOpen && !isLoginOrRegisterPage
              ? "ml-64"
              : isLoginOrRegisterPage
                ? ""
                : "ml-16"
              }`}
          >
            <main className="flex-1 p-4 overflow-y-auto">{children}</main>
          </div>
        </div>
      </div>

      <ToastContainer className="z-50" />
    </QueryClientProvider>
  );
}
