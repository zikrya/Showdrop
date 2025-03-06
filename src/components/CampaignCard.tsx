"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDate } from "../lib/utils"

type Campaign = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
};

type Props = {
  campaign: Campaign;
  admin?: boolean;
  index?: number;
};

export default function CampaignCard({ campaign, admin = false, index = 0 }: Props) {
  const router = useRouter();

  const handleClick = () => {
    if (admin) {
      router.push(`/admin/campaigns/${campaign.id}/codes`);
    } else {
      router.push(`/campaigns/${campaign.id}`);
    }
  };

  const formattedDate = formatDate(campaign.createdAt, { month: "short", day: "numeric", year: "numeric" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      whileHover={{
        y: -2,
        transition: { duration: 0.2 },
      }}
      onClick={handleClick}
      className="group cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-200"
    >
      <div className="p-5">
        <div className="flex items-start">
          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0"></div>
          <h2 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
            {campaign.name}
          </h2>
        </div>
        <p className="mt-2 text-gray-600 text-sm pl-4">{campaign.description || "No description provided."}</p>
        <div className="mt-4 flex items-center text-xs text-gray-400 pl-4">
          <Calendar className="mr-1 h-3 w-3" />
          <span>Created on {formattedDate}</span>
        </div>
      </div>
    </motion.div>
  );
}
