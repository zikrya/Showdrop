import { NextResponse } from "next/server";
import { addDiscountCodesSchema } from "@/lib/validation";
import { db } from "@/lib/db";
import { discountCodes } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { pathname } = new URL(req.url);
    const id = pathname.split("/").at(-2);

    if (!id) {
      return NextResponse.json({ error: "Campaign ID is missing" }, { status: 400 });
    }

    const body = await req.json();
    const parsedBody = addDiscountCodesSchema.parse(body);

    const insertedCodes = await db.insert(discountCodes).values(
      parsedBody.codes.map((code: string) => ({
        campaignId: id,
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

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return NextResponse.json({ error: "Campaign ID is missing" }, { status: 400 });
    }

    const codes = await db.select({ code: discountCodes.code }).from(discountCodes).where(eq(discountCodes.campaignId, params.id));

    return NextResponse.json(codes.map((c) => c.code));
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch discount codes" }, { status: 500 });
  }
}
