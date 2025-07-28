"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaTag, FaSignOutAlt, FaBars, FaUserCircle, FaStore, FaShoppingCart, FaBox, FaFolderOpen, FaClipboardList } from "react-icons/fa";
import { capitalizeWords } from "@/utils/stringUtils";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/client/axios-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { IoHomeSharp } from "react-icons/io5";
import { useAuth } from "@/satelite/services/authService";
import UserProfileSkeleton from "./skeletons/dashboard/UserProfileSkeleton";
import UpdateUserModal from "./modal/UpdateUserModal";

type SidebarProps = {
  setIsOpen: (isOpen: boolean) => void;
};

export default function Sidebar({ setIsOpen }: SidebarProps) {
  const queryClient = useQueryClient();

  const [isOpen, setLocalIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldRenderContent, setShouldRenderContent] = useState(false);

  const { data: user, isLoading } = useAuth();

  const menuGroups = [
    {
      title: "Main Menu",
      items: [
        { name: "Home", icon: <IoHomeSharp />, path: "/" },
        { name: "Banner", icon: <FaFolderOpen />, path: "/banner" },
      ],
    },
    {
      title: "Product Management",
      items: [
        { name: "Brand", icon: <FaStore />, path: "/brands" },
        { name: "Categories", icon: <FaTag />, path: "/categories" },
        { name: "Products", icon: <FaBox />, path: "/products" },
      ],
    },
    {
      title: "Orders",
      items: [
        { name: "Order List", icon: <FaShoppingCart />, path: "/orders" },
        { name: "Input Order", icon: <FaClipboardList />, path: "/orders/create" },
      ],
    },
    {
      title: "User Management",
      items: [
        { name: "Users", icon: <FaUserCircle />, path: "/users" },
      ],
    },
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

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isOpen) {
      timeout = setTimeout(() => setShouldRenderContent(true), 100);
    } else {
      setShouldRenderContent(false);
    }

    return () => clearTimeout(timeout);
  }, [isOpen]);

  return (
    <>
      <div
        className={`group fixed h-screen ${isOpen ? "w-64" : "w-16"} bg-gray-900 text-white flex flex-col justify-between transition-all duration-300 shadow-lg overflow-hidden`}
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
            <span className={`${shouldRenderContent ? "block" : "hidden"} text-xl transition-opacity duration-300`}>E-Commerce</span>
            <FaBars className={`text-2xl ${isOpen ? "hidden" : "block"}`} />
          </Link>
        </div>

        {/* Menu */}
        <div className="flex flex-col mt-6 px-3">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="mb-4">
              {shouldRenderContent && (
                <p className="text-xs text-gray-400 font-semibold uppercase px-2 mb-1 tracking-wide transition-opacity duration-300">
                  {group.title}
                </p>
              )}

              {group.items.map((menu, index) => (
                <Link
                  key={index}
                  href={menu.path}
                  className="flex items-center gap-4 py-3 px-2 text-base hover:bg-gray-800 rounded-lg transition"
                >
                  <div className="text-xl">{menu.icon}</div>
                  <span className={`${shouldRenderContent ? "block" : "hidden"} transition-opacity duration-300`}>
                    {menu.name}
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto px-3 mb-6">
          <button className="flex items-center gap-4 py-3 px-2 hover:bg-gray-800 rounded-lg w-full transition">
            {shouldRenderContent ? (
              isLoading ? (
                <UserProfileSkeleton />
              ) : (
                <div
                  onClick={() => setIsModalOpen(true)}
                  className="flex justify-between w-full items-center"
                >
                  <div className="flex flex-col text-left">
                    <p className="text-sm font-medium">{user ? user.email : "Admin Internal"}</p>
                    <span className="text-xs text-gray-400">
                      {user ? capitalizeWords(user.role) : "User"}
                    </span>
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
              )
            ) : (
              <div className="flex justify-center w-full">
                <FaUserCircle className="text-2xl text-gray-400" />
              </div>
            )}
          </button>
        </div>
      </div>

      <UpdateUserModal isOpen={isModalOpen} onClose={setIsModalOpen} />
    </>
  );
}
