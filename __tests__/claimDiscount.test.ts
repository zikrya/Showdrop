jest.mock("nanoid");

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

import { POST } from "@/app/api/campaigns/[id]/claim/route";
import { db } from "../src/lib/db";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      json: async () => data,
      status: options?.status || (data.error ? 400 : 200),
    })),
  },
}));

jest.mock("../src/lib/db", () => ({
  db: {
    transaction: jest.fn(async (callback) => {
      const limitMock = jest.fn().mockResolvedValue([
        { id: "1", code: "DISCOUNT50", assignedToEmail: null },
      ]);

      const whereMock = jest.fn(() => ({
        limit: limitMock,
      }));

      const fromMock = jest.fn(() => ({
        where: whereMock,
      }));

      const selectMock = jest.fn(() => ({
        from: fromMock,
      }));

      const returningMock = jest.fn().mockResolvedValue([{ id: "1", code: "DISCOUNT50", assignedToEmail: "user@example.com" }]);
      const whereUpdateMock = jest.fn(() => ({
        returning: returningMock,
      }));
      const setMock = jest.fn(() => ({
        where: whereUpdateMock,
      }));
      const updateMock = jest.fn(() => ({
        set: setMock,
      }));

      return callback({
        select: selectMock,
        update: updateMock,
      });
    }),
  },
}));

const mockRequest = (body: object) =>
  new Request("http://localhost/api/campaigns/claim", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

describe("Claim Discount API", () => {
  it("should claim a discount code successfully", async () => {
    const response = await POST(mockRequest({ email: "user@example.com" }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data[0].code).toBe("DISCOUNT50");
  });

  it("should return an error when no discount codes are left", async () => {
    (db.transaction as jest.Mock).mockImplementation(async (callback) => {
      return callback({
        select: jest.fn(() => ({
          from: jest.fn(() => ({
            where: jest.fn(() => ({
              limit: jest.fn().mockResolvedValue([]),
            })),
          })),
        })),
        update: jest.fn().mockResolvedValue([]),
      });
    });


    const response = await POST(mockRequest({ email: "user@example.com" }));
    const data = await response.json();


    expect(response.status).toBe(400);
    expect(data.error).toBe("No discount codes left.");
  });
});
