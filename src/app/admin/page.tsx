import CampaignListLayout from "@/components/CampaignListLayout"

export default function AdminCampaignsPage() {
  return (
    <CampaignListLayout
      title="Your Campaigns"
      fetchUrl="/api/user-campaign"
      showCreateButton={true}
      createButtonLabel="Create Campaign"
      createButtonHref="/admin/new"
    />
  )
}
