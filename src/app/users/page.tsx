"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // ✅ 1. Verify current user
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
          { withCredentials: true }
        );
        setCurrentUser(res.data.data);
      } catch (err: any) {
        setError("You are not authorized to view this page");
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, []);

  // ✅ 2. Fetch users if admin
  useEffect(() => {
    if (currentUser?.role === "admin") {
      const fetchUsers = async () => {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/clients`,
            { withCredentials: true }
          );
          setUsers(res.data.data);
        } catch (err: any) {
          setError(err.response?.data?.message || "Failed to load users");
        }
      };
      fetchUsers();
    }
  }, [currentUser]);

  // ✅ 3. Handle role change
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setUpdatingUserId(userId);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/clients/${userId}`,
        { role: newRole },
        { withCredentials: true }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err: any) {
      console.error("Failed to update role:", err);
      alert(err.response?.data?.message || "Failed to update user role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-center">
        <h2 className="text-3xl font-semibold mb-4 text-red-600">
          Not Authorized
        </h2>
        <p className="text-gray-600">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  // ✅ Admin view
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Users</h2>
        <p className="text-sm text-gray-500">Total users: {users.length}</p>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <ul className="space-y-3">
        {users.map((u) => {
          const isLocked = u.email === "eccentricecc481@gmail.com"; // super admin lock

          return (
            <li
              key={u._id}
              className="border p-4 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-gray-900">{u.name}</h3>
                <p className="text-sm text-gray-600">{u.email}</p>
              </div>

              {isLocked ? (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-200 text-green-800">
                  Admin (Locked)
                </span>
              ) : updatingUserId === u._id ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  <span className="text-gray-600 text-sm">Saving...</span>
                </div>
              ) : (
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                  className="border border-gray-300 text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
