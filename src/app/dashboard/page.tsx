"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

interface Order {
  _id: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  status: string;
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin-auth");
    if (!token) {
      router.push("/login");
    } else {
      fetchOrders();
    }
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    await fetch("/api/updateOrder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, newStatus }),
    });

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-700">Admin Dashboard</h2>
          <LogoutButton />
        </div>

        {/* Loading & Error Handling */}
        {loadingOrders && <p className="text-gray-500 text-center">Loading orders...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-sm sm:text-base">
                <th className="border p-3">Order ID</th>
                <th className="border p-3">Customer</th>
                <th className="border p-3 hidden sm:table-cell">Email</th>
                <th className="border p-3 hidden md:table-cell">Phone</th>
                <th className="border p-3">Status</th>
                <th className="border p-3">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="border text-sm sm:text-base hover:bg-gray-50">
                    <td className="border p-3">
                      <Link href={`/orders/${order._id}`} className="text-blue-600 hover:underline">
                        {order._id}
                      </Link>
                    </td>
                    <td className="border p-3">
                      <Link href={`/orders/${order._id}`} className="text-blue-600 hover:underline">
                        {order.customerName || "N/A"}
                      </Link>
                    </td>
                    <td className="border p-3 hidden sm:table-cell">{order.email || "N/A"}</td>
                    <td className="border p-3 hidden md:table-cell">{order.phoneNumber || "N/A"}</td>
                    <td className="border p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-md text-xs sm:text-sm font-medium ${
                          order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Out for Delivery"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="border p-3 text-center">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-600">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}