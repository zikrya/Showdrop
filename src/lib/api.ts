export async function fetchCampaign(id: string) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const url = `${baseUrl}/api/campaigns/${id}`;
      console.log("Fetching campaign from:", url); // ✅ Debug log

      const res = await fetch(url);

      if (!res.ok) {
        const errorText = await res.text(); // Get response error
        throw new Error(`Failed to fetch campaign: ${res.status} - ${errorText}`);
      }

      return await res.json();
    } catch (error) {
      console.error("Error fetching campaign:", error);
      return null;
    }
  }
