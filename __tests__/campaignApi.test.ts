import { GET, POST } from "@/app/api/campaigns/route";

import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

if (typeof global.Request === "undefined") {
  global.Request = class {
    method: string;
    url: string;
    headers: Headers;
    body: any;
    constructor(url: string, init: RequestInit) {
      this.url = url;
      this.method = init.method || "GET";
      this.headers = new Headers(init.headers);
      this.body = init.body;
    }
    async json() {
      return JSON.parse(this.body);
    }
  };
}

jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn().mockReturnValue({
    userId: "mock-user-123",
  }),
  currentUser: jest.fn().mockResolvedValue({
    id: "mock-user-123",
  }),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data) => ({ json: async () => data, status: 200 })),
  },
  Request: jest.fn(),
}));

jest.mock("../src/lib/db", () => ({
  db: {
    insert: jest.fn(() => ({
      values: jest.fn(() => ({
        returning: jest.fn().mockResolvedValue([
          {
            id: "1",
            name: "New Campaign",
            description: "Test campaign",
            brandName: "Zack INC",
            location: "New York",
          },
        ]),
      })),
    })),
    select: jest.fn(() => ({
      from: jest.fn().mockResolvedValue([
        { id: "1", name: "Test Campaign" },
      ]),
    })),
  },
}));

describe("Campaign API", () => {
  it("should return all campaigns", async () => {
    const response = await GET();
    const data = await response.json();


    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(1);
    expect(data.success).toBe(true);
    expect(data.data[0].name).toBe("Test Campaign");
  });

  it("should create a new campaign", async () => {
    const mockRequest = new Request("http://localhost/api/campaigns", {
      method: "POST",
      body: JSON.stringify({
        name: "New Campaign",
        description: "Test campaign",
        brandName: "Zack INC",
        location: "New York",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    console.log("RESPONSE DATA:", data);

    expect(response.status).toBe(200);
    expect(data.data[0].name).toBe("New Campaign");
    expect(data.data[0].description).toBe("Test campaign");
    expect(data.data[0].brandName).toBe("Zack INC");
    expect(data.data[0].location).toBe("New York");
  });
});
