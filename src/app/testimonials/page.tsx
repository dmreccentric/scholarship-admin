"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Testimonial {
  _id: string;
  name: string;
  message: string;
  approved: boolean;
  profilePicture?: {
    url: string;
    public_id: string;
    resource_type?: "image";
  };
  media?: {
    url: string;
    public_id: string;
    resource_type?: "image" | "video";
  };
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/testimonials`,
          { withCredentials: true }
        );
        setTestimonials(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load testimonials");
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      setDeletingId(id);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/testimonials/${id}`,
        { withCredentials: true }
      );
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete testimonial");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/testimonials/${id}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mt-12 mb-6">
        <h2 className="text-3xl font-bold text-black dark:text-gray-300">
          Testimonials
        </h2>

        <Link
          href="/testimonials/create"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200"
        >
          + Create Testimonial
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
              <div className="h-16 w-16 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div className="flex-1 ml-4 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-40"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 w-16 bg-gray-300 rounded"></div>
                <div className="h-8 w-16 bg-gray-300 rounded"></div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-4 my-5">
          {testimonials.map((t) => (
            <li
              key={t._id}
              className="border p-4 rounded-md flex items-center space-x-4"
            >
              {/* ✅ Profile Picture */}
              {t.profilePicture?.url ? (
                <img
                  src={t.profilePicture.url}
                  alt={t.name + " profile"}
                  className="h-16 w-16 object-cover rounded-full flex-shrink-0 border-2 border-purple-500"
                />
              ) : (
                <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm flex-shrink-0 border-2 border-gray-300">
                  No Profile
                </div>
              )}

              <div className="flex-1">
                <h3 className="font-semibold">{t.name}</h3>
                <p className="text-sm text-gray-600">{t.message}</p>

                {/* ✅ Testimonial media */}
                {t.media?.url && (
                  <div className="mt-2">
                    {t.media.resource_type === "video" ? (
                      <video
                        src={t.media.url}
                        controls
                        className="h-40 w-full rounded-md object-cover"
                      />
                    ) : (
                      <img
                        src={t.media.url}
                        alt={t.name + " media"}
                        className="h-40 w-full rounded-md object-cover"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* ✅ Actions */}
              <div className="space-y-2 flex flex-col">
                <button
                  onClick={() => handleEdit(t._id)}
                  disabled={deletingId === t._id}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
                  disabled={deletingId === t._id}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                >
                  {deletingId === t._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
