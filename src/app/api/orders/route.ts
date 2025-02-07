import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

export async function GET() {
  try {
    const orders = await client.fetch(`*[_type == "order" ]{
      _id,
    customerName,
    email,
    phoneNumber,
    status,
    totalPrice,
    "cartItems": cartItems[] {
      "product": product->{_id, name, price},
      quantity
    }
  }`)
    
    console.log("✅ Orders fetched:", orders);

    return NextResponse.json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return NextResponse.json({ message: "Failed to fetch orders", error }, { status: 500 });
  }
}