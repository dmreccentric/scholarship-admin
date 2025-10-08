"use client";
import { useEffect, useState } from "react";
// import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import api from "../../lib/api";

interface Scholarship {
  _id: string;
  institution: string;
  title: string;
  description: string;
  hostCountry: string;
  category: string;
  eligibleCountries: string[];
  reward: string;
  stipend: string;
  deadline: string;
  healthInsurance: boolean;
  ieltsRequired: boolean;
  fullyFunded: boolean;
  image?: {
    url: string;
    public_id: string;
  };
}

export default function EditScholarshipPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<Partial<Scholarship>>({});
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        const res = await api.get(
          `${process.env.NEXT_PUBLIC_API_URL}/scholarships/${id}`,
          { withCredentials: true }
        );
        setForm(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load scholarship");
      }
    };
    fetchScholarship();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type, value } = e.target;

    if (type === "checkbox") {
      setForm({
        ...form,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else if (name === "eligibleCountries") {
      setForm({
        ...form,
        eligibleCountries: value
          .split(",")
          .map((c) => c.trim())
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
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // append text fields
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value as any);
          }
        }
      });

      // append file if new one selected
      if (file) {
        formData.append("image", file);
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/scholarships/${id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      router.push("/scholarships");
    } catch (err: any) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-6 text-green-700 dark:text-green-400 text-center">
        Edit Scholarship
      </h2>
      {error && (
        <p className="text-red-500 dark:text-red-400 text-center mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Inputs */}
        {[
          { label: "Institution", name: "institution", type: "text" },
          { label: "Scholarship Title", name: "title", type: "text" },
          { label: "Host Country", name: "hostCountry", type: "text" },
          { label: "Category", name: "category", type: "text" },
          {
            label: "Eligible Countries (comma-separated)",
            name: "eligibleCountries",
            type: "text",
          },
          { label: "Reward", name: "reward", type: "text" },
          { label: "Stipend", name: "stipend", type: "text" },
          { label: "Deadline", name: "deadline", type: "date" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={
                field.name === "eligibleCountries"
                  ? form.eligibleCountries?.join(", ") || ""
                  : field.name === "deadline"
                  ? form.deadline
                    ? form.deadline.substring(0, 10)
                    : ""
                  : (form as any)[field.name] || ""
              }
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md 
                         bg-gray-50 dark:bg-gray-800 
                         text-black dark:text-white 
                         placeholder-black dark:placeholder-black
                         border-gray-300 dark:border-gray-700
                         focus:ring-2 focus:ring-green-500"
              required={[
                "institution",
                "title",
                "hostCountry",
                "category",
              ].includes(field.name)}
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
            className="w-full border px-3 py-2 rounded-md 
                       bg-gray-50 dark:bg-gray-800 
                       text-black dark:text-black 
                       placeholder-black dark:placeholder-black
                       border-gray-300 dark:border-gray-700
                       focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: "healthInsurance", label: "Includes Health Insurance" },
            { name: "ieltsRequired", label: "IELTS Required" },
            { name: "fullyFunded", label: "Fully Funded" },
          ].map((cb) => (
            <label
              key={cb.name}
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-200"
            >
              <input
                type="checkbox"
                name={cb.name}
                checked={(form as any)[cb.name] || false}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 dark:ring-offset-gray-900"
              />
              <span>{cb.label}</span>
            </label>
          ))}
        </div>

        {/* Existing Image */}
        {form.image?.url && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Current Image:
            </p>
            <img
              src={form.image.url}
              alt="Scholarship"
              className="w-48 rounded-md border border-gray-300 dark:border-gray-700 mb-2"
            />
          </div>
        )}

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Upload New Image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border px-3 py-2 rounded-md 
                       bg-gray-50 dark:bg-gray-800 
                       text-black dark:text-white
                       border-gray-300 dark:border-gray-700
                       focus:ring-2 focus:ring-green-500"
          />
          {file && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Selected: {file.name}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
