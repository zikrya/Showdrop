"use client";

import { useState } from "react";

export default function AddCodesForm({ campaignId, onCodesAdded }: { campaignId: string; onCodesAdded: (codes: string[]) => void }) {
  const [codes, setCodes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const codeArray = codes.split("\n").map((code) => code.trim()).filter((code) => code.length > 0);

    try {
      const res = await fetch(`/api/campaigns/${campaignId}/codes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codes: codeArray }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add discount codes");

      onCodesAdded(codeArray);
      setCodes("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <label className="block text-sm font-medium mb-2">Add Discount Codes (one per line)</label>
      <textarea
        className="w-full p-2 border rounded"
        rows={4}
        value={codes}
        onChange={(e) => setCodes(e.target.value)}
        placeholder="Enter discount codes, one per line..."
      ></textarea>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-600 text-white rounded mt-2 disabled:opacity-50">
        {loading ? "Adding..." : "Add Codes"}
      </button>
    </form>
  );
}
