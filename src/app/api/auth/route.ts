import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const authResult = await auth();
  const userId = authResult.userId;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await currentUser();
  if (!user) {
    return new NextResponse("User does not exist", { status: 404 });
  }

  let dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, user.id),
  });

  if (!dbUser) {
    await db.insert(users).values({
      id: user.id,
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? "",
    });
  } else {
    await db
      .update(users)
      .set({
        email: user.emailAddresses[0]?.emailAddress ?? "",
      })
      .where(eq(users.clerkId, user.id));
  }

  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: "/"
    },
  });
}
