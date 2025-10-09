"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        { name, email, password },
        { withCredentials: true }
      );
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen ">
      {/* ✅ Theme toggle fixed at top-right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* ✅ Centered register box */}
      <div className="w-full max-w-md p-8 bg-white dark:bg-neutral-900 shadow-lg rounded-2xl border border-gray-200 dark:border-neutral-800">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Register
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 dark:border-neutral-700 bg-transparent px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 dark:border-neutral-700 bg-transparent px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 dark:border-neutral-700 bg-transparent px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-2 rounded-lg transition ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button> */}

          {/* 🔒 Disabled button */}
          <button
            type="submit"
            disabled
            className="w-full bg-gray-400 text-white font-semibold py-2 rounded-lg cursor-not-allowed opacity-70"
          >
            Register (Disabled)
          </button>
        </form>

        <h3 className="mt-4 text-center text-gray-700 dark:text-gray-300">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-700 hover:underline">
            Login
          </Link>
        </h3>
      </div>
    </div>
  );
}
