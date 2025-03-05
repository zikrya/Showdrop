"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CampaignCard from "../../components/CampaignCard";

type Campaign = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
};

export default function CampaignListPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await fetch("/api/campaigns");
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch campaigns: ${errorText}`);
        }

        const data: Campaign[] = await res.json();
        setCampaigns(data);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setError("Failed to load campaigns. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchCampaigns();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">All Campaigns</h1>

      {loading && <p>Loading campaigns...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && campaigns.length === 0 && <p>No campaigns found.</p>}

      <ul className="space-y-4">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </ul>
    </div>
  );
}
