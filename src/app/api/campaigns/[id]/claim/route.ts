import { NextResponse } from "next/server";
import { claimDiscountCode } from "@/lib/services/discountService";

export async function POST(req: Request) {
  try {
    const { pathname } = new URL(req.url);
    const campaignId = pathname.split("/").at(-2);
    if (!campaignId) return NextResponse.json({ error: "Campaign ID is missing" }, { status: 400 });

    const body = await req.json();
    const code = await claimDiscountCode(campaignId, body.email);

    return NextResponse.json(code, { status: 200 });
  } catch (err) {
    console.error("Error claiming discount code:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "An unexpected error occurred" }, { status: 500 });
  }
}

