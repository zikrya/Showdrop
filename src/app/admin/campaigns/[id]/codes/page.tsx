"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AddCodesForm from "@/components/AddCodesForm";
import CodeList from "@/components/CodeList";

export default function AdminCampaignCodesPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0] || "";

  const [codes, setCodes] = useState<{ code: string; assignedToEmail: string | null }[]>([]);
  const [stats, setStats] = useState<{ total: number; claimed: number; remaining: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCodes() {
      if (!id) return;

      try {
        const res = await fetch(`/api/campaigns/${id}/codes`);
        if (!res.ok) throw new Error("Failed to fetch discount codes");

        const data = await res.json();
        setCodes(data.codes);
        setStats({ total: data.total, claimed: data.claimed, remaining: data.remaining });
      } catch (err) {
        console.error("Error fetching campaign codes:", err);
        setError("Failed to load campaign data.");
      } finally {
        setLoading(false);
      }
    }

    fetchCodes();
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Discount Codes</h1>

      {loading && <p>Loading campaign data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {stats && <CodeList codes={codes} total={stats.total} claimed={stats.claimed} remaining={stats.remaining} />}

      <AddCodesForm
        campaignId={id}
        onCodesAdded={(newCodes) => setCodes([...codes, ...newCodes.map((code) => ({ code, assignedToEmail: null }))])}
      />
    </div>
  );
}
