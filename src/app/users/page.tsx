"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users`,
          { withCredentials: true }
        );
        setUsers(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2">
        {users.map((u) => (
          <li key={u._id} className="border p-4 rounded-md">
            <h3 className="font-semibold">{u.name}</h3>
            <p>{u.email}</p>
            <span className="text-sm bg-gray-300 dark:bg-gray-700 px-2 py-1 rounded">
              {u.role}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
