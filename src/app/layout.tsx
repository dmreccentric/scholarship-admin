"use client";

import "./globals.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { ThemeProvider } from "./context/ThemeContext";
import PersistLogin from "./components/PersistLogin";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ We can hide Navbar + Sidebar on login/register pages
  const pathname = usePathname();
  const isAuthPage = ["/login", "/register"].includes(pathname);

  return (
    <html lang="en">
      <body className="bg-white dark:bg-black text-black dark:text-white">
        <ThemeProvider>
          <PersistLogin>
            {!isAuthPage && <Navbar />}
            <div className="flex">
              {!isAuthPage && <Sidebar />}
              <main className="flex-1 p-6">{children}</main>
            </div>
          </PersistLogin>
        </ThemeProvider>
      </body>
    </html>
  );
}
