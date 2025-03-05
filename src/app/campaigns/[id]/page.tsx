import { notFound } from "next/navigation";
import { MapPin, Building2, Calendar, ArrowLeft, Share2, Edit, Tag } from 'lucide-react';
import CampaignForm from "@/components/CampaignForm";
import { fetchCampaign } from "../../../lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

type ParamsType = { id: string }

export default async function CampaignPage({ params }: { params: Promise<ParamsType> }) {
  const { id } = await params

  if (!id) return notFound()

  const campaign = await fetchCampaign(id)

  if (!campaign) return notFound()

  const formattedDate = new Date(campaign.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      <div className="container max-w-6xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <Link href="/campaigns">
            <Button variant="ghost" className="pl-0 text-gray-600 hover:text-gray-900 hover:bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Campaigns
            </Button>
          </Link>

          <div className="flex items-center gap-2">
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-blue-50 text-blue-500 hover:bg-blue-100 px-2 py-0.5 text-xs font-medium border-0">
              Active
            </Badge>
            <span className="text-sm text-gray-500">Campaign ID: {id.slice(0, 8)}</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">{campaign.name}</h1>

          {campaign.description && <p className="text-gray-600 max-w-3xl">{campaign.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-white to-blue-50/30 border-blue-100/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Brand</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <Building2 className="h-5 w-5 text-blue-400 mr-2" />
              <span className="font-medium">{campaign.brandName || "N/A"}</span>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-purple-50/30 border-purple-100/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Location</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <MapPin className="h-5 w-5 text-purple-400 mr-2" />
              <span className="font-medium">{campaign.location || "N/A"}</span>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-green-50/30 border-green-100/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Created On</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <Calendar className="h-5 w-5 text-green-400 mr-2" />
              <span className="font-medium">{formattedDate}</span>
            </CardContent>
          </Card>
        </div>

        <Card className="border-gray-200/70 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center">
              <Tag className="h-5 w-5 text-blue-400 mr-2" />
              <CardTitle>Claim Your Discount</CardTitle>
            </div>
            <CardDescription>Enter your email below to receive your exclusive discount code.</CardDescription>
          </CardHeader>
          <Separator className="bg-gray-100" />
          <CardContent className="pt-6">
            <CampaignForm campaignId={id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
