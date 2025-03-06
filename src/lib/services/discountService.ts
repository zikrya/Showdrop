import { db } from "@/lib/db";
import { discountCodes, campaigns } from "@/lib/schema";
import { eq, and, isNull } from "drizzle-orm";
import { addDiscountCodesSchema, claimDiscountSchema } from "@/lib/validation";
import { nanoid } from "nanoid";


function generateUniqueCodes(count: number, existingCodes: Set<string>): string[] {
  const generatedCodes: string[] = [];

  while (generatedCodes.length < count) {
    const newCode = nanoid(10).toUpperCase();

    if (!existingCodes.has(newCode)) {
      generatedCodes.push(newCode);
      existingCodes.add(newCode);
    }
  }

  return generatedCodes;
}

export async function addDiscountCodes(
  campaignId: string,
  userId: string,
  codes?: string[],
  generate?: number
) {
  const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, campaignId)).limit(1);
  if (!campaign) throw new Error("Campaign not found");
  if (campaign.createdBy !== userId) throw new Error("You are not the owner of this campaign");

  const existingCodes = new Set(
    (await db.select().from(discountCodes).where(eq(discountCodes.campaignId, campaignId))).map((c) => c.code)
  );

  let newCodes: string[] = [];

  if (generate && typeof generate === "number") {
    newCodes = generateUniqueCodes(generate, existingCodes);
  } else if (codes) {
    const parsedBody = addDiscountCodesSchema.parse({ codes });
    newCodes = parsedBody.codes.filter((code) => !existingCodes.has(code));
  }

  if (newCodes.length === 0) throw new Error("No new unique discount codes were added.");

  return await db
    .insert(discountCodes)
    .values(newCodes.map((code) => ({ campaignId, code })))
    .returning();
}

export async function getDiscountCodes(campaignId: string, userId: string) {
  const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, campaignId)).limit(1);
  if (!campaign) throw new Error("Campaign not found");
  if (campaign.createdBy !== userId) throw new Error("You are not the owner of this campaign");

  const codes = await db.select().from(discountCodes).where(eq(discountCodes.campaignId, campaignId));

  return {
    campaign,
    stats: {
      total: codes.length,
      claimed: codes.filter((c) => c.assignedToEmail !== null).length,
      remaining: codes.filter((c) => c.assignedToEmail === null).length,
    },
    codes,
  };
}

export async function claimDiscountCode(campaignId: string, email: string) {
  const parsedBody = claimDiscountSchema.parse({ email });

  return await db.transaction(async (tx) => {
    const availableCode = await tx
      .select()
      .from(discountCodes)
      .where(and(eq(discountCodes.campaignId, campaignId), isNull(discountCodes.assignedToEmail)))
      .limit(1);

    if (!availableCode.length) throw new Error("No discount codes left.");

    return await tx
      .update(discountCodes)
      .set({ assignedToEmail: parsedBody.email })
      .where(eq(discountCodes.id, availableCode[0].id))
      .returning();
  });
}
