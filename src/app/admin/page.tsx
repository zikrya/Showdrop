"use client"

import { useState } from "react"
import CampaignListLayout from "@/components/CampaignListLayout"
import CreateCampaignForm from "@/components/CreateCampaignForm"

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

      {showCreateForm && <CreateCampaignForm onClose={() => setShowCreateForm(false)} />}
    </>
  )
}
