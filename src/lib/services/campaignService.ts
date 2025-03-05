import { db } from "../db";
import { campaigns, discountCodes } from "../schema";
import { eq } from "drizzle-orm";

export async function createCampaign(
  name: string,
  description: string | undefined,
  brandName: string,
  location: string,
  createdBy: string
) {
  return await db.insert(campaigns).values({
    name,
    description,
    brandName,
    location,
    createdBy,
  }).returning();
}

export async function getAllCampaigns() {
  return await db.select().from(campaigns);
}

export async function deleteCampaign(campaignId: string, userId: string) {
  const campaign = await db.query.campaigns.findFirst({
    where: eq(campaigns.id, campaignId),
  });

  if (!campaign) {
    throw new Error("Campaign not found");
  }

  if (campaign.createdBy !== userId) {
    throw new Error("Forbidden: You do not own this campaign");
  }

  await db.delete(discountCodes).where(eq(discountCodes.campaignId, campaignId));
  await db.delete(campaigns).where(eq(campaigns.id, campaignId));

  return { success: true, message: "Campaign deleted successfully" };
}
