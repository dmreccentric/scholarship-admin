"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Visa {
  _id: string;
  country: string;
  title: string;
  description: string;
  image?: {
    url: string;
    public_id: string;
  };
}

export default function VisasPage() {
  const [visas, setVisas] = useState<Visa[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchVisas = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/visas`,
          { withCredentials: true }
        );
        setVisas(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load visas");
      } finally {
        setLoading(false);
      }
    };
    fetchVisas();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this visa?")) return;
    try {
      setDeletingId(id);
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/visas/${id}`, {
        withCredentials: true,
      });
      setVisas((prev) => prev.filter((v) => v._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete visa");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/visas/${id}`);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-10 mb-6 space-y-3 sm:space-y-0">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Visas
        </h2>

        <Link
          href="/visas/create"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200"
        >
          + Create Visa
        </Link>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <ul className="space-y-2 my-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <li
              key={i}
              className="border p-4 rounded-md animate-pulse flex items-center justify-between"
            >
              <div className="h-16 w-16 bg-gray-300 rounded-md flex-shrink-0"></div>
              <div className="flex-1 ml-4 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-40"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 w-16 bg-gray-300 rounded"></div>
                <div className="h-8 w-16 bg-gray-300 rounded"></div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-2 my-5">
          {visas.map((v) => (
            <li
              key={v._id}
              className="border p-4 rounded-md flex items-center justify-between"
            >
              {v.image?.url ? (
                <img
                  src={v.image.url}
                  alt={v.title}
                  className="h-16 w-16 object-cover rounded-md flex-shrink-0"
                />
              ) : (
                <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm">
                  No Img
                </div>
              )}

              <div className="flex-1 ml-4">
                <h3 className="font-semibold">{v.title}</h3>
                <p>{v.country}</p>
              </div>

              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(v._id)}
                  disabled={deletingId === v._id}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(v._id)}
                  disabled={deletingId === v._id}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                >
                  {deletingId === v._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
