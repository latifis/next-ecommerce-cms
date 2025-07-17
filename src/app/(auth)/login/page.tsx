"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLogin } from "@/satelite/services/authService";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          toast.success("Login successful");
          const token = data.data.token;
          Cookies.set('token', token, { expires: 1, secure: true, sameSite: 'Strict' })
          router.push("/");
        },
        onError: (err: unknown) => {
          if (err instanceof AxiosError && err.response) {
            toast.error(err.response?.data?.message || "An error occurred during login");
          } else if (err instanceof Error) {
            toast.error(err.message || "An unexpected error occurred");
          }
        },
      }
    );
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 py-12">
      {/* Main Card */}
      <div className="relative z-10 flex w-full max-w-5xl rounded-2xl overflow-hidden shadow-lg bg-white">

        {/* Left Panel - Admin CTA */}
        <div className="w-2/5 relative hidden md:flex flex-col justify-center items-start text-white bg-emerald-800 p-10 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <Image
              src="/images/patterns/abstract.png"
              alt="Pattern"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          </div>

          {/* Left Panel Content */}
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Admin Panel</h2>
            <p className="text-sm mb-6">
              This area is reserved for admin only. Please use your credentials to log in and manage the system.
            </p>
            <p className="text-xs text-gray-200 italic">
              Don&apos;t have an account? Contact the system administrator.
            </p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full md:w-3/5 flex items-center justify-center bg-white px-6 py-12">
          <div className="w-full max-w-sm space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold text-center text-emerald-700">
                Admin Login
              </h2>
              <p className="text-sm text-center text-gray-500 mt-1">
                Sign in to manage orders, products, and users.
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  className="mt-1 w-full rounded-lg border border-emerald-300 px-4 py-2 text-sm text-emerald-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="mt-1 w-full rounded-lg border border-emerald-300 px-4 py-2 text-sm text-emerald-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
                <div className="text-right mt-1">
                  <Link href="/forgot-password" className="text-xs text-emerald-500 hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className={`w-full py-2 rounded-lg text-white font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-500
              ${loginMutation.isPending
                    ? "bg-emerald-600 cursor-not-allowed opacity-70"
                    : "bg-emerald-700 hover:bg-emerald-800"}
            `}
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
