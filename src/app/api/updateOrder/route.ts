import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const { orderId, newStatus } = await req.json();

    if (!orderId || !newStatus) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const mutations = [
      {
        patch: {
          id: orderId,
          set: { status: newStatus },
        },
      },
    ];

    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    const apiToken = process.env.SANITY_API_TOKEN;

    if (!projectId || !dataset || !apiToken) {
      return NextResponse.json({ error: "Sanity environment variables missing" }, { status: 500 });
    }

    const sanityResponse = await fetch(
      `https://${projectId}.api.sanity.io/v2023-01-01/data/mutate/${dataset}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({ mutations }),
      }
    );

    const result = await sanityResponse.json();
    console.log(result)

    if (!sanityResponse.ok) {
      return NextResponse.json(
        { error: result, message: "Failed to update order" },
        { status: sanityResponse.status }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}