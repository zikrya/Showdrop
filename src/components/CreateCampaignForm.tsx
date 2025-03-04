"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCampaignSchema } from "@/lib/validation";
import { createCampaignAction } from "@/lib/actions";
import { z } from "zod";

type CreateCampaignFormValues = z.infer<typeof createCampaignSchema>;

export default function CreateCampaignForm({ onClose }: { onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCampaignFormValues>({
    resolver: zodResolver(createCampaignSchema),
  });

  const onSubmit = async (data: CreateCampaignFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await createCampaignAction(data.name, data.description);

      if (response?.error) {
        setError(response.error);
      } else {
        reset();
        onClose();
        window.location.reload();
      }
    } catch (_err: unknown) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Create New Campaign</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Campaign Name</label>
            <input
              type="text"
              {...register("name")}
              className="w-full p-2 border rounded"
              placeholder="Enter campaign name"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Description (Optional)</label>
            <textarea
              {...register("description")}
              className="w-full p-2 border rounded"
              placeholder="Enter campaign description"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}
