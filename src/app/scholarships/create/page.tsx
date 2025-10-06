"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Scholarship {
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

export default function CreateScholarshipPage() {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Scholarship>>({
    institution: "",
    title: "",
    description: "",
    hostCountry: "",
    category: "",
    eligibleCountries: [],
    reward: "",
    stipend: "",
    deadline: "",
    healthInsurance: false,
    ieltsRequired: false,
    fullyFunded: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

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

      if (imageFile) {
        formData.append("image", imageFile); // matches backend field
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/scholarships`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      router.push("/scholarships");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create scholarship");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-6 text-green-700 dark:text-green-400 text-center">
        Create Scholarship
      </h2>
      {error && (
        <p className="text-red-500 dark:text-red-400 text-center mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Reusable fields */}
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
                  : (form as any)[field.name] || ""
              }
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md 
                         bg-gray-50 dark:bg-gray-800 
                         text-black dark:text-black 
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

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Upload Scholarship Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border px-3 py-2 rounded-md 
                       bg-gray-50 dark:bg-gray-800 
                       text-black dark:text-black 
                       border-gray-300 dark:border-gray-700
                       focus:ring-2 focus:ring-green-500"
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

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Create Scholarship
        </button>
      </form>
    </div>
  );
}
