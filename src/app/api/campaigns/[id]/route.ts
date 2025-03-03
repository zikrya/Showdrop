import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { campaigns } from "../../../../lib/schema"
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
      const { pathname } = new URL(req.url);
      const id = pathname.split("/").at(-2);

      if (!id) {
        return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 });
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