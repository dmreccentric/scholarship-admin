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
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicRoutes = ["/login", "/register"];
    if (publicRoutes.includes(pathname)) {
      setLoading(false);
      return;
    }

    let interval: number;

    const startFakeProgress = () => {
      interval = window.setInterval(() => {
        setProgress((prev) => {
          const increment = Math.random() * (100 - prev) * 0.1;
          const next = prev + increment;
          return next >= 99 ? 99 : next;
        });
      }, 200);
    };

    const verifyUser = async () => {
      try {
        startFakeProgress();
        await api.get("/auth/verify");
        setProgress(100);
        setTimeout(() => setLoading(false), 300); // slight delay for smoothness
      } catch (err) {
        console.log("❌ Not authorized, redirecting...");
        router.push("/login");
      } finally {
        clearInterval(interval);
      }
    };

    verifyUser();

    return () => clearInterval(interval);
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>

        {/* Loading text */}
        <p className="text-lg text-gray-500">
          Checking authentication... {Math.floor(progress)}%
        </p>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
