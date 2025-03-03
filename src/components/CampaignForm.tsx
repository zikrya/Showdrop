"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { claimDiscountSchema } from "../lib/validation";
import { claimDiscountAction } from "../lib/actions";
import { useRouter } from "next/navigation";
import { z } from "zod"

type CampaignFormValues = z.infer<typeof claimDiscountSchema>;

export default function CampaignForm({ campaignId }: { campaignId: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(claimDiscountSchema),
  });

  const onSubmit = async (data: CampaignFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await claimDiscountAction(campaignId, data.email);

      if (response?.error) {
        setError(response.error);
      } else if (response?.redirectUrl) {
        router.push(response.redirectUrl);
      }
    } catch (err: any) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          {...register("email")}
          className="w-full p-2 border rounded"
          placeholder="Enter your email"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full p-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Claim Discount"}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}