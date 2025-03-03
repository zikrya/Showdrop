import { z } from "zod";

export const createCampaignSchema = z.object({
  name: z.string().min(3, "Campaign name must be at least 3 characters"),
  description: z.string().optional(),
});

export const addDiscountCodesSchema = z.object({
  codes: z.array(z.string().min(5, "Discount code must be at least 5 characters")),
});

export const claimDiscountSchema = z.object({
  email: z.string().email("Invalid email format"),
});
