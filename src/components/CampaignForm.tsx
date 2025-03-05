"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { claimDiscountSchema } from "../lib/validation"
import { claimDiscountAction } from "../lib/actions"
import { useRouter } from "next/navigation"
import type { z } from "zod"
import { Loader2, Mail } from "lucide-react"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type CampaignFormValues = z.infer<typeof claimDiscountSchema>

export default function CampaignForm({ campaignId }: { campaignId: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(claimDiscountSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: CampaignFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await claimDiscountAction(campaignId, data.email)

      if (response?.error) {
        setError(response.error)
      } else if (response?.redirectUrl) {
        router.push(response.redirectUrl)
      }
    } catch (_err: unknown) {
      if (_err instanceof Error) {
        setError(_err.message)
      } else {
        setError("An error occurred. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      className="pl-10 h-11 border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </div>
                </FormControl>
                <FormDescription className="text-xs text-gray-500">
                  We&apos;ll send your discount code to this email address.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-md font-medium shadow-sm hover:shadow transition-all duration-200 border-0"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Claim Your Discount"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}

