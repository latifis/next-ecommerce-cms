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
      <div className="flex h-screen w-screen">
        {!isLoginOrRegisterPage && <Sidebar setIsOpen={setIsOpen} />}

        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${isOpen && !isLoginOrRegisterPage
              ? "ml-64"
              : isLoginOrRegisterPage
                ? null
                : "ml-16"
            }`}
        >
          <main className="flex-1 p-4 bg-gray-50 overflow-y-auto">{children}</main>
        </div>
      </div>
      <ToastContainer className="z-50" />
    </QueryClientProvider>
  );
}
