"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Testimonial {
  name: string;
  message: string;
  approved: boolean;
  media?: {
    url: string;
    public_id: string;
    resource_type?: "image" | "video";
  };
  profilePicture?: {
    url: string;
    public_id: string;
  };
}

export default function CreateTestimonialPage() {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Testimonial>>({
    name: "",
    message: "",
    approved: false,
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "media" | "profile"
  ) => {
    if (e.target.files && e.target.files[0]) {
      if (type === "media") setMediaFile(e.target.files[0]);
      else setProfileFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value as any)
      );
      if (mediaFile) formData.append("media", mediaFile);
      if (profileFile) formData.append("profilePicture", profileFile);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/testimonials`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      router.push("/testimonials");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create testimonial");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-purple-700 dark:text-purple-400 text-center">
        Create Testimonial
      </h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
            Message
          </label>
          <textarea
            name="message"
            value={form.message || ""}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
          />
        </div>

        {/* Profile Picture Upload */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
            Profile Picture
          </label>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "profile")}
            className="w-full border px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
          />
          {profileFile && (
            <img
              src={URL.createObjectURL(profileFile)}
              alt="Profile preview"
              className="h-32 w-32 object-cover rounded-full mt-3 mx-auto border"
            />
          )}
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
            Upload Image or Video
          </label>
          <input
            type="file"
            name="media"
            accept="image/*,video/*"
            onChange={(e) => handleFileChange(e, "media")}
            className="w-full border px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
          />
          {mediaFile && (
            <div className="mt-3">
              {mediaFile.type.startsWith("video/") ? (
                <video
                  src={URL.createObjectURL(mediaFile)}
                  controls
                  className="h-40 w-full rounded-md"
                />
              ) : (
                <img
                  src={URL.createObjectURL(mediaFile)}
                  alt="Media preview"
                  className="h-40 w-full object-cover rounded-md"
                />
              )}
            </div>
          )}
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

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center justify-center disabled:opacity-60"
        >
          {submitting ? "Creating..." : "Create Testimonial"}
        </button>
      </form>
    </div>
  );
}
