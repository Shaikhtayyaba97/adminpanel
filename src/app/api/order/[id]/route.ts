import { NextResponse } from 'next/server';
import {client} from '@/lib/sanity';



const fetchOrder = async (id: string) => {
  const query = `*[_type == "order" && _id == $id][0]{
    _id,
    customerName,
    email,
    city,
    address,
    phoneNumber,
    totalPrice,
    "cartItems": cartItems[] {
      "product": product->{
        name,
        "image": image.asset->url, // Fix: Fetching the URL directly
        price
      },
      name,      // fallback fields (as stored directly)
      price,
      quantity,
      "image": image.asset->url // Fallback for directly stored images
    }
  }`;
  const orders = await client.fetch(query, { id });
  return orders ? orders : null;
};

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const orderData = await fetchOrder(params.id);
    if (!orderData) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(orderData);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
} 