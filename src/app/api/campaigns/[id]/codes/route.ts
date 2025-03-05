import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { addDiscountCodesSchema } from "@/lib/validation";
import { db } from "@/lib/db";
import { discountCodes, campaigns } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

// Helper function to generate unique discount codes
function generateUniqueCodes(count: number, existingCodes: Set<string>): string[] {
  const generatedCodes: string[] = [];

  while (generatedCodes.length < count) {
    const newCode = nanoid(10).toUpperCase(); // Generate a 10-character unique code

    if (!existingCodes.has(newCode)) {
      generatedCodes.push(newCode);
      existingCodes.add(newCode);
    }
  }

  return generatedCodes;
}

export async function POST(req: Request) {
  try {
    const authResult = await auth();
    if (!authResult.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = authResult.userId;
    const { pathname } = new URL(req.url);
    const campaignId = pathname.split("/").at(-2);

    if (!campaignId) {
      return NextResponse.json({ error: "Campaign ID is missing" }, { status: 400 });
    }

    const campaign = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, campaignId))
      .limit(1);

    if (!campaign.length || campaign[0].createdBy !== userId) {
      return NextResponse.json({ error: "You are not the owner of this campaign" }, { status: 403 });
    }

    const body = await req.json();

    if (!body.codes && !body.generate) {
      return NextResponse.json({ error: "Must provide either codes or generate count" }, { status: 400 });
    }

    // Fetch existing discount codes to prevent duplicates
    const existingCodes = new Set(
      (await db.select().from(discountCodes).where(eq(discountCodes.campaignId, campaignId))).map((c) => c.code)
    );

    let newCodes: string[] = [];

    if (body.generate && typeof body.generate === "number") {
      newCodes = generateUniqueCodes(body.generate, existingCodes);
    } else {
      const parsedBody = addDiscountCodesSchema.parse(body);
      newCodes = parsedBody.codes.filter((code) => !existingCodes.has(code)); // Avoid adding duplicates
    }

    if (newCodes.length === 0) {
      return NextResponse.json({ error: "No new unique discount codes were added." }, { status: 400 });
    }

    // Insert new discount codes
    const insertedCodes = await db
      .insert(discountCodes)
      .values(
        newCodes.map((code) => ({
          campaignId,
          code,
        }))
      )
      .returning();

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
    const authResult = await auth();
    if (!authResult.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = authResult.userId;

    const { pathname } = new URL(req.url);
    const id = pathname.split("/").at(-2);

    if (!id) {
      return NextResponse.json({ error: "Campaign ID is missing" }, { status: 400 });
    }

    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, id))
      .limit(1);

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (campaign.createdBy !== userId) {
      return NextResponse.json({ error: "You are not the owner of this campaign" }, { status: 403 });
    }

    const codes = await db.select().from(discountCodes).where(eq(discountCodes.campaignId, id));

    return NextResponse.json({
      campaign,
      stats: {
        total: codes.length,
        claimed: codes.filter((c) => c.assignedToEmail !== null).length,
        remaining: codes.filter((c) => c.assignedToEmail === null).length,
      },
      codes,
    });

  } catch (error) {
    console.error("Error fetching campaign data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
