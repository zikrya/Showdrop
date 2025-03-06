import { createCampaignSchema, addDiscountCodesSchema, claimDiscountSchema } from "@/lib/validation";

describe("Validation Tests", () => {
  it("should validate a correct campaign", () => {
    const validData = {
      name: "Test Campaign",
      description: "Valid description",
      brandName: "Zack INC",
      location: "New York",
    };
    expect(() => createCampaignSchema.parse(validData)).not.toThrow();
  });

  it("should fail when campaign name is too short", () => {
    const invalidData = { name: "T", description: "Short name" };
    expect(() => createCampaignSchema.parse(invalidData)).toThrow();
  });

  it("should validate adding discount codes", () => {
    const validData = { codes: ["CODE123", "DISCOUNT50"] };
    expect(() => addDiscountCodesSchema.parse(validData)).not.toThrow();
  });

  it("should validate claiming discount", () => {
    const validData = { email: "test@example.com" };
    expect(() => claimDiscountSchema.parse(validData)).not.toThrow();
  });

  it("should fail if email format is incorrect", () => {
    const invalidData = { email: "invalid-email" };
    expect(() => claimDiscountSchema.parse(invalidData)).toThrow();
  });
});
