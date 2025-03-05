"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Building2, MapPin, Calendar, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DeleteConfirmation } from "@/components/DeleteConfirmation"

type Campaign = {
  id: string
  name: string
  description: string
  createdAt: string
}

export default function AdminCampaignCodesPage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params.id === "string" ? params.id : params.id?.[0] || ""

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [codes, setCodes] = useState<{ code: string; assignedToEmail: string | null }[]>([])
  const [stats, setStats] = useState<{ total: number; claimed: number; remaining: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchCampaignData() {
      if (!id) return

      try {
        const res = await fetch(`/api/campaigns/${id}/codes`)
        if (!res.ok) {
          if (res.status === 403) {
            setError("You do not have permission to access this campaign.")
          } else {
            setError("Failed to fetch campaign details.")
          }
          return
        }

        const data = await res.json()
        setCampaign(data.campaign)
        setCodes(data.codes)
        setStats(data.stats)
        setIsOwner(true)
      } catch (err) {
        console.error("Error fetching campaign data:", err)
        setError("Failed to load campaign data.")
      } finally {
        setLoading(false)
      }
    }

    fetchCampaignData()
  }, [id])

  async function handleDeleteCampaign() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/campaigns/${id}`, { method: "DELETE" })

      if (!res.ok) {
        throw new Error("Failed to delete campaign")
      }

      router.push("/admin")
    } catch (err) {
      console.error("Error deleting campaign:", err)
      alert("Failed to delete campaign. Please try again.")
    } finally {
      setDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <div className="flex items-center justify-between mb-5 border-b pb-4">
        <Button
          variant="ghost"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground p-0"
          onClick={() => router.push("/admin")}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="text-sm font-medium">Back to Campaigns</span>
        </Button>

        <div className="flex gap-2">
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-6 bg-muted/50 rounded-md w-1/4 animate-pulse" />
          <div className="h-3 bg-muted/50 rounded-md w-1/3 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted/50 rounded-md animate-pulse" />
            ))}
          </div>
        </div>
      ) : error ? (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-3.5 w-3.5" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      ) : (
        campaign && (
          <>
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant="outline"
                  className="text-xs px-1.5 py-0 h-5 bg-blue-50/50 text-blue-600 hover:bg-blue-50/50 border-blue-100"
                >
                  Active
                </Badge>
                <span className="text-xs text-muted-foreground">ID: {id.substring(0, 8)}</span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">{campaign.name}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {campaign.description || "No description provided."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <div className="bg-white border border-gray-100 rounded-md p-3 shadow-sm">
                <p className="text-xs text-muted-foreground mb-1.5">Brand</p>
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-blue-500/80" />
                  <span className="text-sm font-medium">Zack Inc</span>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-md p-3 shadow-sm">
                <p className="text-xs text-muted-foreground mb-1.5">Location</p>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-purple-500/80" />
                  <span className="text-sm font-medium">New York, NY</span>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-md p-3 shadow-sm">
                <p className="text-xs text-muted-foreground mb-1.5">Created On</p>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-green-500/80" />
                  <span className="text-sm font-medium">{new Date(campaign.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {stats && (
              <div className="mb-6 bg-white border border-gray-100 rounded-md">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-sm font-medium">Campaign Codes</h2>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground text-xs">Total:</span>
                      <span>{stats.total}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground text-xs">Claimed:</span>
                      <span className="text-green-600">{stats.claimed}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground text-xs">Remaining:</span>
                      <span className="text-blue-600">{stats.remaining}</span>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3">
                  <h3 className="text-sm font-medium mb-2">All Discount Codes</h3>
                  <div className="space-y-1">
                    {codes.map((code) => (
                      <div
                        key={code.code}
                        className="flex items-center justify-between px-3 py-2 bg-gray-50/50 rounded border border-gray-100"
                      >
                        <code className={code.assignedToEmail ? "text-muted-foreground line-through" : ""}>
                          {code.code}
                        </code>
                        {code.assignedToEmail && <span className="text-xs text-muted-foreground">Claimed</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {isOwner && (
              <div className="bg-white border border-gray-100 rounded-md">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-medium">Add New Codes</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Generate new codes for this campaign</p>
                  </div>
                  <Button
                    onClick={() => setIsDeleteDialogOpen(true)}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-red-600 hover:text-red-700 hover:bg-transparent"
                  >
                    Delete Campaign
                  </Button>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <div>
                      <label htmlFor="codes" className="text-sm mb-1.5 block">
                        Add Discount Codes (one per line)
                      </label>
                      <textarea
                        id="codes"
                        className="w-full h-[80px] px-3 py-2 text-sm rounded-md border border-gray-200
                     placeholder:text-muted-foreground focus:outline-none focus:ring-1
                     focus:ring-blue-500/20 focus:border-blue-500"
                        placeholder="Enter discount codes, one per line..."
                      />
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600
                     hover:to-blue-700 text-white shadow-sm"
                      size="sm"
                    >
                      Add Codes
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )
      )}
      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteCampaign}
        campaignName={campaign?.name || ""}
      />
    </div>
  )
}

