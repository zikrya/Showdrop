import { NextResponse } from "next/server";
import { createCampaignSchema } from "@/lib/validation";
import { createCampaign, getAllCampaigns } from "@/lib/services/campaignService";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const authResult = await auth();
    const userId = authResult?.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsedBody = createCampaignSchema.parse(body);

    const campaign = await createCampaign(
      parsedBody.name,
      parsedBody.description,
      parsedBody.brandName,
      parsedBody.location,
      userId
    );

    return NextResponse.json({ success: true, data: campaign }, { status: 201 });
  } catch (err) {
    console.error("Error creating campaign:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const campaigns = await getAllCampaigns();
    return NextResponse.json({ success: true, data: campaigns }, { status: 200 });
  } catch (err) {
    console.error("Error fetching campaigns:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
