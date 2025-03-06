import { createCampaign, getAllCampaigns } from "@/lib/services/campaignService";
import { db } from "../src/lib/db";
import { campaigns } from "../src/lib/schema";

jest.mock("../src/lib/db", () => {
  const mockReturning = jest.fn().mockResolvedValue([
    {
      id: "123",
      name: "New Campaign",
      description: "Test campaign",
      brandName: "Zack INC",
      location: "NY",
      createdBy: "user-123",
    },
  ]);

  const mockValues = jest.fn(() => ({ returning: mockReturning }));
  const mockInsert = jest.fn(() => ({ values: mockValues }));

  return {
    db: {
      insert: mockInsert,
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockResolvedValue([
        { id: "1", name: "Test Campaign 1", description: "First test campaign" },
        { id: "2", name: "Test Campaign 2", description: "Second test campaign" },
      ]),
    },
  };
});

describe("Campaign Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a campaign successfully", async () => {
    const mockCampaignData = {
      name: "New Campaign",
      description: "Test campaign",
      brandName: "Zack INC",
      location: "NY",
      createdBy: "user-123",
    };
    const campaign = await createCampaign(
      mockCampaignData.name,
      mockCampaignData.description,
      mockCampaignData.brandName,
      mockCampaignData.location,
      mockCampaignData.createdBy
    );

    expect(db.insert).toHaveBeenCalledWith(campaigns);
    expect(db.insert().values).toHaveBeenCalledWith(mockCampaignData);
    expect(db.insert().values(mockCampaignData).returning).toHaveBeenCalled();

    expect(campaign).toHaveLength(1);
    expect(campaign[0].name).toBe("New Campaign");
  });

  it("should retrieve all campaigns", async () => {
    const campaignsList = await getAllCampaigns();

    expect(db.select).toHaveBeenCalled();
    expect(db.select().from).toHaveBeenCalledWith(campaigns);
    expect(campaignsList).toHaveLength(2);
    expect(campaignsList[0].name).toBe("Test Campaign 1");
  });
});
