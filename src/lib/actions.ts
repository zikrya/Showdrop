"use server";
import { db } from "./db";
import { discountCodes, campaigns } from "./schema";
import { eq, and, isNull, gt } from "drizzle-orm";
import { createCampaignSchema } from "./validation";
import { auth } from "@clerk/nextjs/server";

const RATE_LIMIT_MINUTES = 1;

export async function claimDiscountAction(campaignId: string, email: string) {
  try {
    const existingCode = await db
      .select()
      .from(discountCodes)
      .where(and(eq(discountCodes.assignedToEmail, email), eq(discountCodes.campaignId, campaignId)))
      .limit(1);

    if (existingCode.length > 0) {
      return { error: "You have already claimed a discount code for this campaign." };
    }

    const now = new Date();
    const rateLimitTime = new Date(now.getTime() - RATE_LIMIT_MINUTES * 60 * 1000);

    const recentClaim = await db
      .select()
      .from(discountCodes)
      .where(
        and(
          eq(discountCodes.assignedToEmail, email),
          eq(discountCodes.campaignId, campaignId),
          gt(discountCodes.lastClaimedAt, rateLimitTime)
        )
      )
      .limit(1);

    if (recentClaim.length > 0) {
      return { error: "Please wait before claiming another discount code." };
    }

    const availableCode = await db
      .select()
      .from(discountCodes)
      .where(and(eq(discountCodes.campaignId, campaignId), isNull(discountCodes.assignedToEmail)))
      .limit(1);

    if (availableCode.length === 0) {
      return { error: "No more discount codes available for this campaign." };
    }

    const assignedCode = availableCode[0].code;

    await db
      .update(discountCodes)
      .set({ assignedToEmail: email, assignedAt: now, lastClaimedAt: now })
      .where(eq(discountCodes.id, availableCode[0].id));

    return { success: true, redirectUrl: `/campaigns/${campaignId}/success?code=${assignedCode}` };
  } catch (error) {
    console.error("Error claiming discount:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function createCampaignAction(
  name: string,
  description?: string,
  brandName?: string,
  location?: string
) {
  try {
    const authResult = await auth();
    const userId = authResult?.userId;

    if (!userId) {
      return { error: "You must be signed in to create a campaign." };
    }

    createCampaignSchema.parse({ name, description, brandName, location });

    const [newCampaign] = await db
      .insert(campaigns)
      .values({
        name,
        description,
        brandName: brandName ?? "",
        location: location ?? "",
        createdBy: userId,
      })
      .returning();

    return { success: true, campaign: newCampaign };
  } catch (error) {
    console.error("Error creating campaign:", error);
    return { error: "Failed to create campaign. Please try again." };
  }
}
