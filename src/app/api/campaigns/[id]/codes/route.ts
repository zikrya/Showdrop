import { NextResponse } from "next/server";
import { addDiscountCodesSchema } from "@/lib/validation";
import { db } from "@/lib/db";
import { discountCodes } from "@/lib/schema";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const parsedBody = addDiscountCodesSchema.parse(body);

    const insertedCodes = await db.insert(discountCodes).values(
      parsedBody.codes.map((code: string) => ({
        campaignId: params.id,
        code,
      }))
    ).returning();

    return NextResponse.json(insertedCodes, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
