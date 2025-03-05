import { db } from "@/lib/db";
import { campaigns } from "@/lib/schema";

async function testDB() {
  try {
    const newCampaign = await db.insert(campaigns).values({
      name: "Test Campaign",
      description: "This is a test",
      brandName: "Test Brand",
      location: "Test Location",
      createdBy: "test-user-id",
    }).returning();

    console.log("Campaign:", newCampaign);
  } catch (err) {
    console.error("DB Connection Error:", err);
  }
}

testDB();


