"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

interface Testimonial {
  name: string;
  message: string;
  approved: boolean;
  media?: {
    url: string;
    public_id: string;
    resource_type?: "image" | "video";
  };
}

export default function EditTestimonialPage() {
  const router = useRouter();
  const { id } = useParams(); // ✅ Get ID from URL
  const [form, setForm] = useState<Partial<Testimonial>>({
    name: "",
    message: "",
    approved: false,
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch existing testimonial on mount
  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/testimonials/${id}`,
          { withCredentials: true }
        );
        setForm(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load testimonial");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTestimonial();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMediaFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", form.name || "");
      formData.append("message", form.message || "");
      formData.append("approved", String(form.approved || false));

      // ✅ Only include new media if one is uploaded
      if (mediaFile) {
        formData.append("media", mediaFile);
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/testimonials/${id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      router.push("/testimonials");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update testimonial");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <p className="text-center text-gray-600">Loading testimonial...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-purple-700 dark:text-purple-400 text-center">
        Edit Testimonial
      </h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 text-black border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Message
          </label>
          <textarea
            name="message"
            value={form.message || ""}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 text-black border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Upload New Image or Video (optional)
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="w-full border px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 text-black border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500"
          />

          {/* Preview Section */}
          <div className="mt-3">
            {mediaFile ? (
              mediaFile.type.startsWith("video/") ? (
                <video
                  src={URL.createObjectURL(mediaFile)}
                  controls
                  className="h-40 w-full rounded-md"
                />
              ) : (
                <img
                  src={URL.createObjectURL(mediaFile)}
                  alt="Preview"
                  className="h-40 w-full object-cover rounded-md"
                />
              )
            ) : form.media?.url ? (
              form.media.resource_type === "video" ? (
                <video
                  src={form.media.url}
                  controls
                  className="h-40 w-full rounded-md"
                />
              ) : (
                <img
                  src={form.media.url}
                  alt={form.name}
                  className="h-40 w-full object-cover rounded-md"
                />
              )
            ) : (
              <div className="h-40 w-full flex items-center justify-center border-2 border-dashed text-gray-400 rounded-md">
                No Media Uploaded
              </div>
            )}
          </div>
        </div>

        {/* Approved Checkbox */}
        <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-200">
          <input
            type="checkbox"
            name="approved"
            checked={form.approved || false}
            onChange={handleChange}
            className="h-4 w-4 text-purple-600"
          />
          <span>Approved</span>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center justify-center disabled:opacity-60"
        >
          {submitting && (
            <svg
              className="animate-spin mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
          {submitting ? "Editing..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
