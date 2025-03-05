"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import Link from "next/link"
import CampaignCard from "@/components/CampaignCard"

type Campaign = {
  id: string
  name: string
  description?: string
  createdAt: string
}

type CampaignListLayoutProps = {
  title: string
  showCreateButton?: boolean
  createButtonLabel?: string
  createButtonHref?: string
  fetchUrl: string
}

export default function CampaignListLayout({
  title,
  showCreateButton = false,
  createButtonLabel,
  createButtonHref,
  fetchUrl
}: CampaignListLayoutProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  async function fetchCampaigns() {
    setLoading(true)
    try {
      const res = await fetch(fetchUrl)
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Failed to fetch campaigns: ${errorText}`)
      }

      const data: Campaign[] = await res.json()
      setCampaigns(data)
    } catch (err) {
      console.error("Error fetching campaigns:", err)
      setError("Failed to load campaigns. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-white min-h-[calc(100vh-64px)]">
      <div className="container max-w-6xl mx-auto pt-14 pb-20 px-4 sm:px-6 md:pt-16 md:pb-24">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>

          {showCreateButton && createButtonHref && (
            <Link
              href={createButtonHref}
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm transition-all duration-200 hover:shadow"
            >
              <Plus className="mr-2 h-4 w-4" />
              {createButtonLabel}
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-[180px] rounded-md border border-gray-200 bg-gray-50 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 md:p-10 border border-gray-200 rounded-md">
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchCampaigns}
              className="mt-4 px-4 py-2 rounded-md text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center p-8 md:p-10 border border-gray-200 rounded-md">
            <h3 className="text-lg font-medium">No campaigns yet</h3>
            <p className="mt-1 text-sm text-gray-500">Create your first campaign to get started.</p>
            {showCreateButton && createButtonHref && (
              <Link
                href={createButtonHref}
                className="inline-flex items-center mt-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm transition-all duration-200 hover:shadow"
              >
                <Plus className="mr-2 h-4 w-4" />
                {createButtonLabel}
              </Link>
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
    </div>
  )
}
