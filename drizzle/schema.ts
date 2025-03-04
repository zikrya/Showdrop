import { pgTable, uuid, text, timestamp, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const discountCodes = pgTable("discount_codes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	campaignId: uuid("campaign_id").notNull(),
	code: text().notNull(),
	assignedToEmail: text("assigned_to_email"),
	assignedAt: timestamp("assigned_at", { mode: 'string' }),
	lastClaimedAt: timestamp("last_claimed_at", { mode: 'string' }),
});

export const campaigns = pgTable("campaigns", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	createdBy: text("created_by").notNull(),
});

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	email: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	clerkId: text("clerk_id").notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
	unique("users_clerk_id_unique").on(table.clerkId),
]);
