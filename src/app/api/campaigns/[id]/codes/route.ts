import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDiscountCodes, addDiscountCodes } from "@/lib/services/discountService";

export async function POST(req: Request) {
  try {
    const authResult = await auth();
    if (!authResult?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = authResult.userId;
    const { pathname } = new URL(req.url);
    const campaignId = pathname.split("/").at(-2);
    if (!campaignId) return NextResponse.json({ error: "Campaign ID is missing" }, { status: 400 });

    const body = await req.json();
    const newCodes = await addDiscountCodes(campaignId, userId, body.codes, body.generate);

    return NextResponse.json(newCodes, { status: 201 });
  } catch (err) {
    console.error("Error adding discount codes:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "An unexpected error occurred" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const authResult = await auth();
    if (!authResult?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = authResult.userId;
    const { pathname } = new URL(req.url);
    const campaignId = pathname.split("/").at(-2);
    if (!campaignId) return NextResponse.json({ error: "Campaign ID is missing" }, { status: 400 });

    const data = await getDiscountCodes(campaignId, userId);
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error fetching discount codes:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
