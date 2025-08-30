import React, { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Button from "../Button";
import { Reward } from "@/types/rewards";
import moment from "moment";

interface RewardRowProps {
  reward: Reward;
  index: number;
  onEdit?: (reward: Reward) => void;
  onDelete?: (id: string) => void;
  onView?: (reward: Reward) => void;
  onStatusChange?: (id: string, status: number) => void;
  page: number;
  pageSize: number;
}

const RewardRow: React.FC<RewardRowProps> = ({
  reward,
  index,
  onEdit,
  onDelete,
  onView,
  onStatusChange,
  page,
  pageSize,
}) => {
  const [loadingStatus, setLoadingStatus] = useState(false);

  const handleStatusToggle = async () => {
    if (onStatusChange) {
      setLoadingStatus(true);
      await onStatusChange(reward.id, reward.status === 1 ? 0 : 1);
      setLoadingStatus(false);
    }
  };

  return (
    <tr className="transition-colors hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-600">
        #{(page - 1) * pageSize + index + 1}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="font-medium">{reward.name}</div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="font-medium">{reward.brand_name}</div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{reward.reward_type}</td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {reward.logo ? (
          <img
            src={reward.logo}
            alt="Sponsor Logo"
            className="h-12 w-16 rounded-lg object-contain shadow-sm"
          />
        ) : (
          <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-gray-100">
            <span className="text-xs text-gray-400">No logo</span>
          </div>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {reward.total_coupons}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{reward.used_coupons}</td>
      {/* <td className="px-4 py-3 text-sm">
        <button
          onClick={handleStatusToggle}
          disabled={loadingStatus}
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            loadingStatus
              ? "cursor-wait bg-gray-100 text-gray-400"
              : !reward.status
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-red-100 text-red-700 hover:bg-red-200"
          }`}
        >
          {loadingStatus
            ? "Updating..."
            : !reward.status
              ? "Active"
              : "Inactive"}
        </button>
      </td> */}
      <td className="px-4 py-3 text-sm text-gray-600">{reward.description}</td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {moment(reward.createdAt).format("DD-MM-YYYY HH:mm")}
      </td>
      <td className="px-4 py-3 text-sm">
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onView?.(reward)}
            title="View Reward"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit?.(reward)}
            title="Edit Reward"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          {/* <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete?.(reward.id)}
            title="Delete Reward"
          >
            <Trash2 className="h-4 w-4" />
          </Button> */}
        </div>
      </td>
    </tr>
  );
};

export default RewardRow;
