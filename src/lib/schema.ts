import { pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const campaigns = pgTable("campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const discountCodes = pgTable("discount_codes", {
  id: serial("id").primaryKey(),
  campaignId: uuid("campaign_id").references(() => campaigns.id),
  code: text("code").unique().notNull(),
  assignedToEmail: text("assigned_to_email").unique(),
  assignedAt: timestamp("assigned_at"),
});
