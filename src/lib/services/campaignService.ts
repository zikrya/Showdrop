import { db } from "../db";
import { campaigns } from "../schema";

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
