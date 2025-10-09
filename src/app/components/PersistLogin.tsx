"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import api from "../lib/api";

export default function PersistLogin({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicRoutes = ["/login", "/register"]; // ✅ unprotected pages
    if (publicRoutes.includes(pathname)) {
      setLoading(false);
      return;
    }

    // ✅ verify token or cookie with backend
    const verifyUser = async () => {
      try {
        await api.get("/auth/verify");
        setLoading(false);
      } catch (err) {
        console.log("❌ Not authorized, redirecting...");
        router.push("/login");
      }
    };

    verifyUser();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
}
