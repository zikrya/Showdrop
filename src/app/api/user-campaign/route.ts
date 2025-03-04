import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { campaigns } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const authResult = await auth();
    const userId = authResult.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch campaigns created by the logged-in user
    const userCampaigns = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.createdBy, userId));

    return NextResponse.json(userCampaigns, { status: 200 });

  } catch (error) {
    console.error("Error fetching user campaigns:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
