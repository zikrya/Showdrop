import CampaignForm from "../../../components/CampaignForm";
import { fetchCampaign } from "../../../lib/api";
import { notFound } from "next/navigation";

type ParamsType = { id: string };

export default async function CampaignPage({ params }: { params: Promise<ParamsType> }) {
  const { id } = await params;

  if (!id) return notFound();

  const campaign = await fetchCampaign(id);

  if (!campaign) return notFound();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{campaign.name}</h1>
      <p className="text-gray-600">{campaign.description || "No description provided."}</p>

      <p className="text-gray-600">
        <strong>Brand:</strong> {campaign.brandName || "N/A"}
      </p>
      <p className="text-gray-600">
        <strong>Location:</strong> {campaign.location || "N/A"}
      </p>

      <CampaignForm campaignId={id} />
    </div>
  );
}
