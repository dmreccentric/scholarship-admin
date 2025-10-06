"use client";
import React from "react";
import ThemeToggle from "./ThemeToggle";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar(): React.ReactElement {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      router.push("/login"); // always redirect
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-white dark:bg-gray-900 border-b dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-black dark:text-white">
            Admin Dashboardd
          </h1>
          <Link
            href={"/"}
            className="text-lg font-semibold text-black dark:text-white"
          >
            Admin Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded bg-red-600 text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
