import React from "react";
import { Eye, Pencil, Trash2, Copy } from "lucide-react";
import Button from "../Button";
import { Contest } from "@/types/contest";
import moment from "moment";

interface ContestRowProps {
  contest: Contest;
  index: number;
  category?: string;
  onView?: (contest: Contest) => void;
  onEdit?: (contest: Contest) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (contest: Contest) => void;
}

const ContestRow: React.FC<ContestRowProps> = ({
  contest,
  index,
  category,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
}) => {
  return (
    <tr className="transition-colors hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-600">#{index + 1}</td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="max-w-[200px] truncate font-medium">{contest.name}</div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        ${contest.contestFee || 0}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {contest.sponsored_logo ? (
          <img
            src={contest.sponsored_logo}
            alt="Sponsor Logo"
            className="h-10 w-15 object-contain"
          />
        ) : (
          <span className="text-gray-400">No logo</span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {moment(contest.startDate).format("YYYY-MM-DD")}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {moment(contest.startDate).format("HH:mm")}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {moment(contest.endDate).format("YYYY-MM-DD")}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {moment(contest.endDate).format("HH:mm")}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800">
          {contest.contestTypeName}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="max-w-[150px] truncate">{contest.sponsored_name}</div>
      </td>
      <td className="px-4 py-3 text-sm">
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onView?.(contest)}
            title="View Contest"
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          {category !== "live" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit?.(contest)}
              title="Edit Contest"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          
          {category !== "old" && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete?.(contest.id)}
              title="Delete Contest"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          
          {category === "old" && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onDuplicate?.(contest)}
              title="Duplicate Contest"
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ContestRow;