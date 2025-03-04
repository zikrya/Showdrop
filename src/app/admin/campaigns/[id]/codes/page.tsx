"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AddCodesForm from "@/components/AddCodesForm";
import CodeList from "@/components/CodeList";

type Campaign = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

export default function AdminCampaignCodesPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0] || "";

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [codes, setCodes] = useState<{ code: string; assignedToEmail: string | null }[]>([]);
  const [stats, setStats] = useState<{ total: number; claimed: number; remaining: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCampaignData() {
      if (!id) return;

      try {
        // Fetch campaign details
        const campaignRes = await fetch(`/api/campaigns/${id}`);
        if (!campaignRes.ok) throw new Error("Failed to fetch campaign details");
        const campaignData = await campaignRes.json();
        setCampaign(campaignData);

        // Fetch discount codes
        const codesRes = await fetch(`/api/campaigns/${id}/codes`);
        if (!codesRes.ok) throw new Error("Failed to fetch discount codes");

        const codesData = await codesRes.json();
        setCodes(codesData.codes);
        setStats({ total: codesData.total, claimed: codesData.claimed, remaining: codesData.remaining });

      } catch (err) {
        console.error("Error fetching campaign data:", err);
        setError("Failed to load campaign data.");
      } finally {
        setLoading(false);
      }
    }

    fetchCampaignData();
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      {loading && <p>Loading campaign data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {campaign && (
        <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
          <h1 className="text-2xl font-semibold">{campaign.name}</h1>
          <p className="text-gray-600">{campaign.description || "No description provided."}</p>
          <p className="text-sm text-gray-400">Created on {new Date(campaign.createdAt).toLocaleDateString()}</p>
        </div>
      )}

      {stats && <CodeList codes={codes} total={stats.total} claimed={stats.claimed} remaining={stats.remaining} />}

      <AddCodesForm
        campaignId={id}
        onCodesAdded={(newCodes) => setCodes([...codes, ...newCodes.map((code) => ({ code, assignedToEmail: null }))])}
      />
    </div>
  );
}
