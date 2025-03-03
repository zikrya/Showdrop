import { NextResponse } from "next/server";
import { claimDiscountSchema } from "@/lib/validation";
import { db } from "@/lib/db";
import { discountCodes } from "@/lib/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const parsedBody = claimDiscountSchema.parse(body);

    const code = await db.transaction(async (tx) => {
      const availableCode = await tx.select().from(discountCodes)
        .where(and(eq(discountCodes.campaignId, params.id), isNull(discountCodes.assignedToEmail)))
        .limit(1);

      if (!availableCode.length) throw new Error("No discount codes left.");

      return await tx.update(discountCodes)
        .set({ assignedToEmail: parsedBody.email })
        .where(eq(discountCodes.id, availableCode[0].id))
        .returning();
    });

    return NextResponse.json(code, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
