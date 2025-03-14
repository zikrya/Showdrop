import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { campaigns, discountCodes } from "@/lib/schema";
import { addDiscountCodesSchema } from "@/lib/validation";
import { eq } from "drizzle-orm";
import { deleteCampaign } from "@/lib/services/campaignService";

export async function POST(req: Request) {
  try {
    const authResult = await auth();
    const userId = authResult.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const pathnameSegments = url.pathname.split("/");
    const campaignId = pathnameSegments.at(-1);

    if (!campaignId) {
      return NextResponse.json({ error: "Campaign ID is missing" }, { status: 400 });
    }

    const campaign = await db.query.campaigns.findFirst({
      where: eq(campaigns.id, campaignId),
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (campaign.createdBy !== userId) {
      return NextResponse.json({ error: "Forbidden: You do not own this campaign" }, { status: 403 });
    }

    const body = await req.json();
    const parsedBody = addDiscountCodesSchema.parse(body);

    const insertedCodes = await db.insert(discountCodes).values(
      parsedBody.codes.map((code: string) => ({
        campaignId,
        code,
      }))
    ).returning();

    return NextResponse.json(insertedCodes, { status: 201 });

  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const pathnameSegments = url.pathname.split("/");
    const id = pathnameSegments.at(-1);

    if (!id) {
      return NextResponse.json({ error: "Campaign ID is missing" }, { status: 400 });
    }

    const campaign = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, id))
      .limit(1);

    if (!campaign.length) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json(campaign[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function DELETE(req: Request) {
  try {
    const authResult = await auth();
    const userId = authResult?.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const pathnameSegments = url.pathname.split("/");
    const campaignId = pathnameSegments.at(-1);

    if (!campaignId) {
      return NextResponse.json({ error: "Campaign ID is missing" }, { status: 400 });
    }

    await deleteCampaign(campaignId, userId);

    return NextResponse.json({ success: true, message: "Campaign deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting campaign:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}