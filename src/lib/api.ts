export async function fetchCampaign(id: string) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/api/campaigns/${id}`);

      if (!res.ok) throw new Error("Failed to fetch campaign");
      return await res.json();
    } catch (error) {
      console.error("Error fetching campaign:", error);
      return null;
    }
  }
