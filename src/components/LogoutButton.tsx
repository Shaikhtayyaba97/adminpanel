"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("admin-auth"); // Remove authentication token
    router.push("/login"); // Redirect to login
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded transition"
    >
      Logout
    </button>
  );
}