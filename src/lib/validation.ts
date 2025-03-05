import { z } from "zod";

export const createCampaignSchema = z.object({
  name: z.string().min(3, "Campaign name must be at least 3 characters").max(50, "Campaign name too long"),
  description: z.string().max(200, "Description too long").optional(),
  brandName: z.string().min(2, "Brand name must be at least 2 characters").max(50, "Brand name too long"),
  location: z.string().min(2, "Location must be at least 2 characters").max(100, "Location too long"),
});

export const addDiscountCodesSchema = z.object({
  codes: z.array(z.string().min(5, "Discount code must be at least 5 characters").regex(/^\S+$/, "No spaces allowed")),
});

export const claimDiscountSchema = z.object({
  email: z.string().email("Invalid email format"),
});
