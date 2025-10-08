import api from "@/lib/api";

export async function verifyUser() {
  try {
    const res = await api.get("/auth/verify", { withCredentials: true });
    console.log("✅ User verified:", res.data.data);
    return res.data.data; // contains id, name, email, role
  } catch (err) {
    console.warn("❌ Verification failed:", err.response?.data?.message);
    return null;
  }
}
