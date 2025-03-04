import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const campaigns = pgTable("campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const discountCodes = pgTable("discount_codes", {
    id: uuid("id").primaryKey().defaultRandom(),
    campaignId: uuid("campaign_id").notNull(),
    code: text("code").notNull(),
    assignedToEmail: text("assigned_to_email"),
    assignedAt: timestamp("assigned_at"),
    lastClaimedAt: timestamp("last_claimed_at"),
  });