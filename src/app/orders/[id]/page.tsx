"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface OrderItem {
  // Optional product reference (if available)
  product?: {
    name: string;
    image?: { asset: { url: string } } | null;
    price: number;
  };
  // Fallback fields stored directly in the order document
  name?: string;
  image?: { asset: { url: string } } | null;
  price?: number;
  quantity: number;
}

interface Order {
  _id: string;
  customerName: string;
  email: string;
  city: string;
  address: string;
  phoneNumber: string;
  totalPrice: number;
  cartItems: OrderItem[];
}

export default function OrderDetails({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`/api/order/${params.id}`);
        console.log("Fetched order data:", response.data);
        setOrder(response.data);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Order Details</h2>
        <p><strong>Customer Name:</strong> {order.customerName}</p>
        <p><strong>Email:</strong> {order.email}</p>
        <p><strong>City:</strong> {order.city}</p>
        <p><strong>Address:</strong> {order.address}</p>
        <p><strong>Phone Number:</strong> {order.phoneNumber}</p>
        <p><strong>Total Price:</strong> {order.totalPrice.toFixed(2)}</p>

        <h3 className="mt-4 text-xl font-semibold">Cart Items</h3>
        <ul>
          {order.cartItems.map((item, index) => {
            // Use product reference data if available; otherwise, fallback to directly stored fields.
            const productData = item.product || {
              name: item.name || "Unknown Product",
              price: item.price || 0,
              image: item.image,
            };

            return (
              <li key={index} className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center">
                  {productData.image?.asset?.url ? (
                    <img
                      src={productData.image.asset.url}
                      alt={productData.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md">
                      <span>No Image found</span>
                    </div>
                  )}
                  <div className="ml-4">
                    <p className="text-lg font-medium">{productData.name}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-lg font-bold">
                  {(item.quantity * (productData.price || 0)).toFixed(2)}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
} 