"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Building2, MapPin, Calendar, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fetchCampaign, fetchDiscountCodes, addDiscountCodes, deleteCampaign } from "@/lib/api";

type Campaign = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

export default function AdminCampaignCodesPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : params.id?.[0] || "";

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [codes, setCodes] = useState<{ code: string; assignedToEmail: string | null }[]>([]);
  const [stats, setStats] = useState<{ total: number; claimed: number; remaining: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [manualCodes, setManualCodes] = useState("");
  const [generateCount, setGenerateCount] = useState(0);
  const [addingCodes, setAddingCodes] = useState(false);

  useEffect(() => {
    async function loadCampaignData() {
      if (!id) return;

      try {
        const campaignData = await fetchCampaign(id);
        const discountCodesData = await fetchDiscountCodes(id);

        if (!campaignData) {
          setError("Failed to fetch campaign details.");
          return;
        }

        setCampaign(campaignData);
        setCodes(discountCodesData.codes);
        setStats(discountCodesData.stats);
        setIsOwner(true);
      } catch (err) {
        console.error("Error fetching campaign data:", err);
        setError("Failed to load campaign data.");
      } finally {
        setLoading(false);
      }
    }

    loadCampaignData();
  }, [id]);

  async function handleDeleteCampaign() {
    setDeleting(true);
    try {
      await deleteCampaign(id);
      router.push("/admin");
    } catch (err) {
      console.error("Error deleting campaign:", err);
      alert("Failed to delete campaign. Please try again.");
    } finally {
      setDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  }

  async function handleAddCodes() {
    setAddingCodes(true);
    try {
      const codesArray = manualCodes
        .split("\n")
        .map((code) => code.trim())
        .filter((code) => code.length > 0);

      const payload: { codes?: string[]; generate?: number } = {};
      if (codesArray.length > 0) payload.codes = codesArray;
      if (generateCount > 0) payload.generate = generateCount;

      const newCodes = await addDiscountCodes(id, payload);

      if (newCodes.error) {
        throw new Error(newCodes.error);
      }

      setCodes([...codes, ...newCodes]);
      setManualCodes("");
      setGenerateCount(0);
    } catch (err) {
      console.error("Error adding codes:", err);
      alert("Failed to add discount codes. Please try again.");
    } finally {
      setAddingCodes(false);
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

        <div className="flex gap-2"></div>
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
                    disabled={deleting}
                    size="sm"
                    className="text-xs text-red-600 hover:text-red-700 hover:bg-transparent"
                  >
                    {deleting ? "Deleting..." : "Delete Campaign"}
                  </Button>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="codes" className="text-sm font-medium mb-1.5 block">
                        Add Discount Codes (one per line)
                      </label>
                      <Textarea
                        id="codes"
                        value={manualCodes}
                        onChange={(e) => setManualCodes(e.target.value)}
                        placeholder="Enter discount codes..."
                        className="w-full h-[80px] text-sm rounded-md border border-gray-200 resize-none"
                      />
                    </div>
                    <div>
                    <label htmlFor="generateCount" className="text-sm font-medium block">
                      Generate Random Codes
                    </label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="generateCount"
                        type="number"
                        min="1"
                        value={generateCount}
                        onChange={(e) => setGenerateCount(Math.max(0, Number(e.target.value) || 0))}
                        className="w-24 text-sm"
                        placeholder="Count"
                      />
                      <span className="text-xs text-muted-foreground">Enter at least 1 code to generate</span>
                    </div>
                  </div>
                  <Button
                    onClick={handleAddCodes}
                    disabled={addingCodes || (!manualCodes.trim() && generateCount < 1)}
                    className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {addingCodes ? "Adding..." : "Add Codes"}
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

