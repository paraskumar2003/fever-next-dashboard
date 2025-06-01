import React from "react";
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
}

const RewardRow: React.FC<RewardRowProps> = ({
  reward,
  index,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <tr className="transition-colors hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-600">#{index + 1}</td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="font-medium">{reward.name}</div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{reward.reward_type}</td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {moment(reward.createdAt).format("YYYY-MM-DD HH:mm")}
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
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete?.(reward.id)}
            title="Delete Reward"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default RewardRow;