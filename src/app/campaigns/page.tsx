import CampaignListLayout from "@/components/CampaignListLayout"

export default function CampaignListPage() {
  return (
    <CampaignListLayout
      title="All Campaigns"
      fetchUrl="/api/campaigns"
    />
  )
}
