"use client"

import { useEffect, useState } from "react"
import CampaignCard from "./CampaignCard"
import { CreateCampaignForm } from "./CreateCampaignForm"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

type Campaign = {
  id: string
  name: string
  description?: string
  createdAt: string
}

interface CampaignListLayoutProps {
  title: string
  subtitle?: string
  fetchUrl: string
  showCreateButton?: boolean
  createButtonLabel?: string
  onCreateCampaign?: () => void
}

export default function CampaignListLayout({
  title,
  subtitle,
  fetchUrl,
  showCreateButton = false,
  createButtonLabel = "Create Campaign",
  onCreateCampaign,
}: CampaignListLayoutProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

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
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="mt-1 text-sm md:text-base text-gray-500">{subtitle}</p>}
          </div>

          {showCreateButton && onCreateCampaign && (
            <Button
              onClick={onCreateCampaign}
              className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm transition-all duration-200 hover:shadow"
            >
              <Plus className="mr-2 h-4 w-4" />
              {createButtonLabel}
            </Button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-[180px] rounded-md border border-gray-200 bg-gray-50 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/10 bg-destructive/5 p-6 text-center">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 md:p-10 text-center">
            <h3 className="text-lg font-medium">No campaigns yet</h3>
            <p className="mt-1 text-sm text-gray-500">Create your first campaign to get started.</p>
            {showCreateButton && onCreateCampaign && (
              <Button
                onClick={onCreateCampaign}
                className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                {createButtonLabel}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {campaigns.map((campaign, index) => (
              <CampaignCard key={campaign.id} campaign={campaign} index={index} />
            ))}
          </div>
        )}
      </div>

      <CreateCampaignForm open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  )
}
