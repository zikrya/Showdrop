import CampaignListLayout from "@/components/campaign-view/CampaignListLayout"

export default function CampaignListPage() {
  return (
    <CampaignListLayout
      title="All Campaigns"
      fetchUrl="/api/campaigns"
    />
  )
}
