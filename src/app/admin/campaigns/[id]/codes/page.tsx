"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AddCodesForm from "../../../../../components/AddCodesForm";
import DiscountCodeList from "../../../../../components/DiscountCodeList";

export default function AdminCampaignCodesPage() {
  const { id } = useParams();
  const [codes, setCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCodes() {
      try {
        const res = await fetch(`/api/campaigns/${id}/codes`);
        if (!res.ok) throw new Error("Failed to fetch discount codes");

        const data = await res.json();
        setCodes(data);
      } catch (err) {
        setError("Failed to load discount codes.");
      } finally {
        setLoading(false);
      }
    }

    fetchCodes();
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Discount Codes</h1>

      {loading && <p>Loading discount codes...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <AddCodesForm campaignId={id} onCodesAdded={(newCodes) => setCodes([...codes, ...newCodes])} />
      <DiscountCodeList codes={codes} />
    </div>
  );
}
