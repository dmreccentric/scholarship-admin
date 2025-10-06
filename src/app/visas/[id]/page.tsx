"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

interface Visa {
  _id: string;
  country: string;
  type: string;
  description: string;
  requirements: string[];
  processingTime: string;
  fee: string;
  image?: {
    url: string;
    public_id: string;
  };
}

export default function EditVisaPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<Partial<Visa>>({});
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVisa = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/visas/${id}`,
          { withCredentials: true }
        );
        setForm(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load visa");
      }
    };
    fetchVisa();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "requirements") {
      setForm({ ...form, requirements: value.split(",").map((r) => r.trim()) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "createdBy") return; // 🚫 Don't send createdBy back

        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value as any);
          }
        }
      });

      if (file) formData.append("image", file);

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/visas/${id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      router.push("/visas");
    } catch (err: any) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400 text-center">
        Edit Visa
      </h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          { label: "Country", name: "country", type: "text" },
          { label: "Visa Type", name: "type", type: "text" },
          { label: "Processing Time", name: "processingTime", type: "text" },
          { label: "Fee", name: "fee", type: "text" },
          {
            label: "Requirements (comma-separated)",
            name: "requirements",
            type: "text",
          },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={
                field.name === "requirements"
                  ? form.requirements?.join(", ") || ""
                  : (form as any)[field.name] || ""
              }
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
              required={["country", "type"].includes(field.name)}
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
            className="w-full border px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
            required
          />
        </div>

        {/* Existing Image */}
        {form.image?.url && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Current Image:</p>
            <img
              src={form.image.url}
              alt="Visa"
              className="w-48 rounded-md mb-2"
            />
          </div>
        )}

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Upload New Image (optional)
          </label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
