import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { campaigns } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");

    const id = segments.at(-1);

    if (!id || id === "undefined") {
      console.error("Campaign ID is missing or invalid:", id);
      return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 });
    }

    console.log(` Fetching campaign with ID: ${id}`);

    const campaign = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, id))
      .limit(1);

    if (!campaign.length) {
      console.warn(` Campaign with ID ${id} not found.`);
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    console.log(` Campaign found:`, campaign[0]);
    return NextResponse.json(campaign[0], { status: 200 });

  } catch (error) {
    console.error(" Error fetching campaign:", error);
    return NextResponse.json({ error: "Internal Server Error", details: String(error) }, { status: 500 });
  }
}
