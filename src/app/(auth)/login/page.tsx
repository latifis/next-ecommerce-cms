"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLogin } from "@/satelite/services/authService";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import { FaSpinner } from "react-icons/fa";

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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-sm text-gray-900 border rounded-md placeholder-gray-400 focus:ring-blue-300 focus:border-blue-300 border-gray-300"
              placeholder="Enter your email"
              required
              disabled={loginMutation.status === 'pending'}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-sm text-gray-900 border rounded-md placeholder-gray-400 focus:ring-blue-300 focus:border-blue-300 border-gray-300"
              placeholder="Enter your password"
              required
              disabled={loginMutation.status === 'pending'}
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-400 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 disabled:bg-blue-300 disabled:cursor-not-allowed"
            disabled={loginMutation.status === "pending"}
          >
            {loginMutation.status === "pending" ? (
              <div className="flex items-center">
                <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                <span>Login...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-400 hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
