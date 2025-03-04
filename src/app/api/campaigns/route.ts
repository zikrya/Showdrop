import { NextResponse } from "next/server";
import { createCampaignSchema } from "@/lib/validation";
import { createCampaign, getAllCampaigns } from "@/lib/services/campaignService";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const authResult = await auth();
    const userId = authResult.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsedBody = createCampaignSchema.parse(body);

    const campaign = await createCampaign(parsedBody.name, parsedBody.description, userId);
    return NextResponse.json(campaign, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

export async function GET() {
  const campaigns = await getAllCampaigns();
  return NextResponse.json(campaigns);
}
