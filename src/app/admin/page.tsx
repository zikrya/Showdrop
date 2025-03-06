"use client"

import { useState } from "react"
import CampaignListLayout from "@/components/campaign-view/CampaignListLayout"
import { CreateCampaignForm } from "@/components/campaign-view/CreateCampaignForm"

export default function AdminCampaignsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)

  return (
    <>
      <CampaignListLayout
        title="Your Campaigns"
        fetchUrl="/api/user-campaign"
        showCreateButton={true}
        createButtonLabel="Create Campaign"
        onCreateCampaign={() => setShowCreateForm(true)}
      />

      {showCreateForm && <CreateCampaignForm open={showCreateForm} onOpenChange={setShowCreateForm} />}
    </>
  )
}
