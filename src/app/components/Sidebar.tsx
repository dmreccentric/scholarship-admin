"use client";
import Link from "next/link";
import React from "react";

/**
 * This component intentionally shows on mobile only (block md:hidden)
 * and is fixed to the bottom so it behaves like a mobile nav bar.
 */
export default function Sidebar(): React.ReactElement {
  return (
    <aside className="block md:hidden fixed inset-x-0 bottom-0 z-40 bg-white dark:bg-gray-900 border-t dark:border-gray-700">
      <nav className="flex justify-around py-2 max-w-7xl mx-auto">
        <Link href="/scholarships" className="text-sm hover:underline">
          Scholarships
        </Link>
        <Link href="/visas" className="text-sm hover:underline">
          Visas
        </Link>
        <Link href="/testimonials" className="text-sm hover:underline">
          Testimonials
        </Link>
        <Link href="/users" className="text-sm hover:underline">
          Users
        </Link>
      </nav>
    </aside>
  );
}
