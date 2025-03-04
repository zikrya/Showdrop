export async function fetchCampaign(id: string) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const url = `${baseUrl}/api/campaigns/${id}`;
      console.log("Fetching campaign from:", url);

      const res = await fetch(url);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch campaign: ${res.status} - ${errorText}`);
      }

      return await res.json();
    } catch (error) {
      console.error("Error fetching campaign:", error);
      return null;
    }
  }

  export async function fetchDiscountCodes(campaignId: string) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const url = `${baseUrl}/api/campaigns/${campaignId}/codes`;

      console.log("Fetching discount codes from:", url);
      const res = await fetch(url);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch discount codes: ${res.status} - ${errorText}`);
      }

      return await res.json();
    } catch (error) {
      console.error("Error fetching discount codes:", error);
      return [];
    }
  }

  export async function addDiscountCodes(campaignId: string, codes: string[]) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const url = `${baseUrl}/api/campaigns/${campaignId}/codes`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codes }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to add discount codes: ${res.status} - ${errorText}`);
      }

      return await res.json();
    } catch (error) {
      console.error("Error adding discount codes:", error);
      return { error: "Failed to add discount codes." };
    }
  }