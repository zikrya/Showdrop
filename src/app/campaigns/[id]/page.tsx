import { fetchCampaign } from "@/lib/api";
import { notFound } from "next/navigation";

export default async function CampaignPage({ params }: { params: { id?: string } }) {
  if (!params?.id) return notFound();

  const campaign = await fetchCampaign(params.id);

  if (!campaign) return notFound();

  return (
    <main className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold">{campaign.name}</h1>
      <p className="text-gray-600 mt-2">{campaign.description || "No description available."}</p>
    </main>
  );
}
