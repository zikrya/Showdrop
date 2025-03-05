"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AddCodesForm from "@/components/AddCodesForm";
import CodeList from "@/components/CodeList";
import { Button } from "@/components/ui/button";

type Campaign = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

export default function AdminCampaignCodesPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : params.id?.[0] || "";

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [codes, setCodes] = useState<{ code: string; assignedToEmail: string | null }[]>([]);
  const [stats, setStats] = useState<{ total: number; claimed: number; remaining: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchCampaignData() {
      if (!id) return;

      try {
        const res = await fetch(`/api/campaigns/${id}/codes`);
        if (!res.ok) {
          if (res.status === 403) {
            setError("You do not have permission to access this campaign.");
          } else {
            setError("Failed to fetch campaign details.");
          }
          return;
        }

        const data = await res.json();
        setCampaign(data.campaign);
        setCodes(data.codes);
        setStats(data.stats);
        setIsOwner(true);
      } catch (err) {
        console.error("Error fetching campaign data:", err);
        setError("Failed to load campaign data.");
      } finally {
        setLoading(false);
      }
    }

    fetchCampaignData();
  }, [id]);

  async function handleDeleteCampaign() {
    if (!confirm("Are you sure you want to delete this campaign? This action cannot be undone.")) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/campaigns/${id}`, { method: "DELETE" });

      if (!res.ok) {
        throw new Error("Failed to delete campaign");
      }

      alert("Campaign deleted successfully!");
      router.push("/admin");
    } catch (err) {
      console.error("Error deleting campaign:", err);
      alert("Failed to delete campaign. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {loading && (
        <div className="animate-pulse">
          <div className="bg-gray-300 h-8 w-3/4 rounded mb-4"></div>
          <div className="bg-gray-200 h-4 w-1/2 rounded mb-6"></div>
          <div className="bg-gray-200 h-20 w-full rounded"></div>
        </div>
      )}

      {!loading && error && <p className="text-red-500">{error}</p>}

      {!loading && campaign && (
        <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
          <h1 className="text-2xl font-semibold">{campaign.name}</h1>
          <p className="text-gray-600">{campaign.description || "No description provided."}</p>
          <p className="text-sm text-gray-400">Created on {new Date(campaign.createdAt).toLocaleDateString()}</p>

          {isOwner && (
            <Button
              onClick={handleDeleteCampaign}
              className="mt-4 bg-red-600 text-white hover:bg-red-700"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Campaign"}
            </Button>
          )}
        </div>
      )}

      {!loading && stats && <CodeList codes={codes} total={stats.total} claimed={stats.claimed} remaining={stats.remaining} />}

      {!loading && isOwner && (
        <AddCodesForm
          campaignId={id}
          onCodesAdded={(newCodes) => setCodes([...codes, ...newCodes.map((code) => ({ code, assignedToEmail: null }))])}
        />
      )}
    </div>
  );
}
