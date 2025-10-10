"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Scholarship {
  _id: string;
  title: string;
  institution: string;
  hostCountry: string;
  image?: {
    url: string;
    public_id: string;
  };
}

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/scholarships`,
          { withCredentials: true }
        );
        setScholarships(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load scholarships");
      } finally {
        setLoading(false);
      }
    };
    fetchScholarships();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this scholarship?")) return;
    try {
      setDeletingId(id);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/scholarships/${id}`,
        { withCredentials: true }
      );
      setScholarships((prev) => prev.filter((s) => s._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete scholarship");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/scholarships/${id}`);
  };

  return (
    <div className="my-10">
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-10 mb-6 space-y-3 sm:space-y-0">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Scholarships
        </h2>

        <Link
          href="/scholarships/create"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200"
        >
          + Create Scholarship
        </Link>
      </div>

      {loading ? (
        <ul className="space-y-2 my-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <li
              key={i}
              className="border p-4 rounded-md animate-pulse flex items-center justify-between"
            >
              {/* Image skeleton */}
              <div className="h-16 w-16 bg-gray-300 rounded-md flex-shrink-0"></div>

              {/* Text skeleton */}
              <div className="flex-1 ml-4 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-40"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>

              {/* Buttons skeleton */}
              <div className="flex space-x-2">
                <div className="h-8 w-16 bg-gray-300 rounded"></div>
                <div className="h-8 w-16 bg-gray-300 rounded"></div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-2 my-5">
          {scholarships.map((s) => (
            <li
              key={s._id}
              className="border p-4 rounded-md flex items-center justify-between"
            >
              {/* Image */}
              {s.image?.url ? (
                <img
                  src={s.image.url}
                  alt={s.title}
                  className="h-16 w-16 object-cover rounded-md flex-shrink-0"
                />
              ) : (
                <div className="h-16 w-16 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center text-gray-500 text-sm">
                  No Img
                </div>
              )}

              {/* Text */}
              <div className="flex-1 ml-4">
                <h3 className="font-semibold">{s.title}</h3>
                <p>
                  {s.institution} - {s.hostCountry}
                </p>
              </div>

              {/* Actions */}
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(s._id)}
                  disabled={deletingId === s._id}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  disabled={deletingId === s._id}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                >
                  {deletingId === s._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
