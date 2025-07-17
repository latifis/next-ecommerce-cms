"use client";

import { useState } from "react";
import Link from "next/link";
import { FaTag, FaSignOutAlt, FaBars, FaUserCircle, FaStore, FaShoppingCart, FaBox, FaFolderOpen } from "react-icons/fa";
import Cookies from 'js-cookie';
import { decodeToken } from "@/utils/decodeToken";
import { capitalizeWords } from "@/utils/stringUtils";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/client/axios-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

type SidebarProps = {
  setIsOpen: (isOpen: boolean) => void;
};

export default function Sidebar({ setIsOpen }: SidebarProps) {
  const queryClient = useQueryClient();

  const [isOpen, setLocalIsOpen] = useState(false);
  const decodedToken = decodeToken(Cookies.get("token"))

  const menus = [
    { name: "Brand", icon: <FaStore />, path: "/brands" },
    { name: "Categories", icon: <FaTag />, path: "/categories" },
    { name: "Orders", icon: <FaShoppingCart />, path: "/orders" },
    { name: "Products", icon: <FaBox />, path: "/products" },
    { name: "Banner", icon: <FaFolderOpen />, path: "/banner" },
  ];

  const router = useRouter();

  const handleLogout = async () => {
    try {
      const message = await apiClient.post("/user/logout", {}, {
        withCredentials: true,
      });

      queryClient.removeQueries({ queryKey: ["profile"] });
      toast.success(message.data.message || "Logout successful");

      setIsOpen(false);

      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div
      className={`group fixed h-screen ${isOpen ? "w-64" : "w-16"} bg-gray-900 text-white flex flex-col justify-between transition-all duration-300 shadow-lg`}
      onMouseEnter={() => {
        setLocalIsOpen(true);
        setIsOpen(true);
      }}
      onMouseLeave={() => {
        setLocalIsOpen(false);
        setIsOpen(false);
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-4 h-20 px-4 border-b border-gray-700">
        <Link
          href="/"
          className={`text-xl font-bold truncate hover:text-gray-400 flex items-center gap-2 ${isOpen ? "justify-center" : "justify-start w-full"}`}
        >
          <span className={`${isOpen ? "block" : "hidden"} text-xl`}>E-Commerce</span>
          <FaBars className={`text-2xl ${isOpen ? "hidden" : "block"}`} />
        </Link>
      </div>

      {/* Menu */}
      <div className="flex flex-col mt-6 px-3">
        {menus.map((menu, index) => (
          <Link
            key={index}
            href={menu.path}
            className="flex items-center gap-4 py-3 px-2 text-base hover:bg-gray-800 rounded-lg transition"
          >
            <div className="text-xl">{menu.icon}</div>
            <span className={`${isOpen ? "block" : "hidden"}`}>{menu.name}</span>
          </Link>
        ))}
      </div>

      <div className="mt-auto px-3 mb-6">
        <button
          className="flex items-center gap-4 py-3 px-2 hover:bg-gray-800 rounded-lg w-full transition"
        >
          <FaUserCircle
            className={`text-2xl ${isOpen ? "block" : "hidden"}`}
            style={{ display: isOpen ? 'block' : 'none' }}
          />

          {isOpen ? (
            <div className="flex justify-between w-full items-center">
              <div className="flex flex-col text-left">
                <p className="text-sm font-medium">{decodedToken ? decodedToken.email : "Admin Internal"}</p>
                <span className="text-xs text-gray-400">{decodedToken ? capitalizeWords(decodedToken.role) : "User"}</span>
              </div>
              <div className="flex items-center">
                <div
                  onClick={handleLogout}
                  className="cursor-pointer hover:bg-gray-700 p-2 rounded-full"
                >
                  <FaSignOutAlt className="text-xl text-gray-400" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center w-full">
              <FaUserCircle className="text-2xl text-gray-400" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
