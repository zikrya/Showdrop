"use client";

import Link from "next/link";

type Campaign = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
};

type Props = {
  campaign: Campaign;
  admin?: boolean;
};

export default function CampaignCard({ campaign, admin = false }: Props) {
  return (
    <li className="p-4 border rounded shadow-md">
      <h2 className="text-lg font-medium">{campaign.name}</h2>
      <p className="text-gray-600">{campaign.description || "No description provided."}</p>
      <p className="text-sm text-gray-400">
        Created on {new Date(campaign.createdAt).toLocaleDateString()}
      </p>
      <Link
        href={admin ? `/admin/campaigns/${campaign.id}/codes` : `/campaigns/${campaign.id}`}
        className="text-blue-600 underline"
      >
        {admin ? "Manage Campaign" : "View Campaign"}
      </Link>
    </li>
  );
}
