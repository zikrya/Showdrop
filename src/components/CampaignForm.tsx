"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { claimDiscountSchema } from "../lib/validation";
import { claimDiscount } from "../lib/actions";
import { z } from "zod";

type CampaignFormValues = z.infer<typeof claimDiscountSchema>;

export default function CampaignForm({ campaignId }: { campaignId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
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
    setSuccess(null);

    try {
      const response = await claimDiscount(campaignId, data.email);
      if (response.error) throw new Error(response.error);
      setSuccess(response.code);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
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
      {success && <p className="text-green-500 text-sm">Your discount code: {success}</p>}
    </form>
  );
}
