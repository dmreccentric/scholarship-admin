"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setloading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setloading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      if (res.data?.data?.token) {
        sessionStorage.setItem("token", res.data.data.token);
      }

      router.push("/scholarships");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen ">
      {/* ✅ Theme toggle fixed at the top-right corner */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* ✅ Centered login box */}
      <div className="w-full max-w-md p-8 bg-white dark:bg-neutral-900 shadow-lg rounded-2xl border border-gray-200 dark:border-neutral-800">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Login
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 dark:border-neutral-700 bg-transparent px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 dark:border-neutral-700 bg-transparent px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 rounded-lg
              ${
                loading
                  ? "bg-blue-500 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800"
              }
              `}
          >
            {loading ? "logging in... " : "Login"}
          </button>
        </form>

        <h3 className="mt-4 text-center text-gray-700 dark:text-gray-300">
          Don't have an account?{" "}
          <Link href={"/register"} className="text-blue-700 hover:underline">
            Register
          </Link>
        </h3>
      </div>
    </div>
  );
}
