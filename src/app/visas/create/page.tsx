"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Visa {
  title: string;
  country: string;
  type: string;
  description: string;
  requirements: string[];
  processingTime: string;
  fee: string;
  deadline: string;
  image?: {
    url: string;
    public_id: string;
  };
}

export default function CreateVisaPage() {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Visa>>({
    title: "",
    country: "",
    type: "",
    description: "",
    requirements: [],
    processingTime: "",
    fee: "",
    deadline: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "requirements") {
      setForm({
        ...form,
        requirements: value
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean),
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      });
      if (imageFile) formData.append("image", imageFile);

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/visas`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.push("/visas");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create visa");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400 text-center">
        Create Visa
      </h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          { label: "Title", name: "title", type: "text" }, // ✅ Added title
          { label: "Country", name: "country", type: "text" },
          { label: "Visa Type", name: "type", type: "text" },
          {
            label: "Requirements (comma-separated)",
            name: "requirements",
            type: "text",
          },
          { label: "Processing Time", name: "processingTime", type: "text" },
          { label: "Fee", name: "fee", type: "text" },
          { label: "Deadline", name: "deadline", type: "date" },
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {f.label}
            </label>
            <input
              type={f.type}
              name={f.name}
              value={
                f.name === "requirements"
                  ? form.requirements?.join(", ") || ""
                  : (form as any)[f.name] || ""
              }
              onChange={handleChange}
              required={["title", "country", "type"].includes(f.name)}
              className="w-full border px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 text-black border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 text-black border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Upload Visa Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 text-black border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create Visa
        </button>
      </form>
    </div>
  );
}
