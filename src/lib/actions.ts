"use server";

import { db } from "./db";
import { discountCodes } from "./schema";
import { eq, and, isNull } from "drizzle-orm";

export async function claimDiscount(campaignId: string, email: string) {
  try {
    const existingCode = await db
      .select()
      .from(discountCodes)
      .where(and(eq(discountCodes.assignedToEmail, email), eq(discountCodes.campaignId, campaignId)))
      .limit(1);

    if (existingCode.length > 0) {
      return { error: "You have already claimed a discount code for this campaign." };
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
      .set({ assignedToEmail: email, assignedAt: new Date() })
      .where(eq(discountCodes.id, availableCode[0].id));

    return { code: assignedCode };
  } catch (error) {
    console.error("Error claiming discount:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
