"use client"

import { useEffect, useState } from "react"
import CampaignCard from "@/components/CampaignCard"
import { Plus } from "lucide-react"

type Campaign = {
  id: string
  name: string
  description?: string
  createdAt: string
}

interface CampaignListLayoutProps {
  title: string
  fetchUrl: string
  showCreateButton?: boolean
  createButtonLabel?: string
  onCreateCampaign?: () => void // Callback for modal
}

export default function CampaignListLayout({
  title,
  fetchUrl,
  showCreateButton,
  createButtonLabel,
  onCreateCampaign,
}: CampaignListLayoutProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await fetch(fetchUrl)
        if (!res.ok) throw new Error("Failed to fetch campaigns")

        const data: Campaign[] = await res.json()
        setCampaigns(data)
      } catch (err) {
        console.error("Error fetching campaigns:", err)
        setError("Failed to load campaigns. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [fetchUrl])

  return (
    <div className="w-full bg-white min-h-[calc(100vh-64px)]">
      <div className="container max-w-6xl mx-auto pt-14 pb-20 px-4 sm:px-6 md:pt-16 md:pb-24">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>

          {showCreateButton && onCreateCampaign && (
            <button
              onClick={onCreateCampaign}
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm transition-all duration-200 hover:shadow"
            >
              <Plus className="mr-2 h-4 w-4" />
              {createButtonLabel}
            </button>
          )}
        </div>

        {loading ? (
          <p>Loading campaigns...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : campaigns.length === 0 ? (
          <p>No campaigns found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
