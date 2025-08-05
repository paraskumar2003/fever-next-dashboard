import React from "react";
import { Eye, Pencil, Trash2, Copy } from "lucide-react";
import Button from "../Button";
import { Contest } from "@/types/contest";
import moment from "moment";
import { useState } from "react";

interface ContestRowProps {
  contest: Contest;
  index: number;
  category?: string;
  onView?: (contest: Contest) => void;
  onEdit?: (contest: Contest) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (contest: Contest) => void;
  onStatusChange?: (id: string, status: number) => void;
  page: number;
  pageSize: number;
  isEditable?: boolean;
}

const ContestRow: React.FC<ContestRowProps> = ({
  contest,
  index,
  category,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onStatusChange,
  isEditable = true,
  page,
  pageSize,
}) => {
  const [loadingStatus, setLoadingStatus] = useState(false);

  const getStatusInfo = (isPublished: boolean, currentCategory?: string) => {
    // Handle different categories with specific logic
    switch (currentCategory) {
      case "draft":
        return {
          displayLabel: "Draft",
          buttonLabel: "Activate",
          color: "bg-blue-100 text-blue-700 hover:bg-green-200",
          nextStatus: 1, // Always activate (set to active)
        };

      case "live":
        // For live page: toggle between Active (status: 1) and Inactive (status: 2)
        return contest.isPublished
          ? {
              displayLabel: "Active",
              buttonLabel: "Deactivate",
              color: "bg-red-100 text-red-700 hover:bg-green-200",
              nextStatus: 2, // Set to inactive
            }
          : {
              displayLabel: "Inactive",
              buttonLabel: "Activate",
              color: "bg-green-100 text-green-700 hover:bg-red-200",
              nextStatus: 1, // Set to active
            };

      case "upcoming":
        // For upcoming page: toggle between Active (status: 1) and Draft (status: 0)
        return isPublished
          ? {
              displayLabel: "Active",
              buttonLabel: "Set to Draft",
              color: "bg-green-100 text-green-700 hover:bg-blue-200",
              nextStatus: 0, // Set to draft
            }
          : {
              displayLabel: "Draft",
              buttonLabel: "Activate",
              color: "bg-blue-100 text-blue-700 hover:bg-green-200",
              nextStatus: 1, // Set to active
            };

      default:
        // For other categories (like "old") - read-only display
        return isPublished
          ? {
              displayLabel: "Active",
              buttonLabel: "Active",
              color: "bg-green-100 text-green-700",
              nextStatus: 1,
            }
          : {
              displayLabel: "Draft",
              buttonLabel: "Draft",
              color: "bg-blue-100 text-blue-700",
              nextStatus: 0,
            };
    }
  };

  const handleStatusToggle = async () => {
    if (!onStatusChange) return;

    setLoadingStatus(true);
    try {
      const statusInfo = getStatusInfo(contest.isPublished, category);
      await onStatusChange(contest.id, statusInfo.nextStatus);
    } catch (error) {
      console.error("Error updating contest status:", error);
    } finally {
      setLoadingStatus(false);
    }
  };

  const statusInfo = getStatusInfo(contest.isPublished, category);
  const canChangeStatus =
    category === "live" || category === "upcoming" || category === "draft";

  return (
    <tr className="transition-colors hover:bg-gray-50/50">
      <td className="px-6 py-4 text-sm font-medium text-gray-900">
        #{(page - 1) * pageSize + index + 1}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        <div className="max-w-[200px] truncate font-semibold">
          {contest.name}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        <span className="font-semibold">₹{contest.contestFee || 0}</span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {contest.sponsored_logo ? (
          <img
            src={contest.sponsored_logo}
            alt="Sponsor Logo"
            className="h-12 w-16 rounded-lg object-contain shadow-sm"
          />
        ) : (
          <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-gray-100">
            <span className="text-xs text-gray-400">No logo</span>
          </div>
        )}
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">
        {moment(contest.startDate).format("DD-MM-YYYY")}
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">
        {moment(contest.startDate).format("HH:mm")}
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">
        {moment(contest.endDate).format("DD-MM-YYYY")}
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">
        {moment(contest.endDate).format("HH:mm")}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-800">
          {contest.contestTypeName}
        </span>
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">
        {contest.total_contest_played}
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">
        {contest.winners_announced}
      </td>
      <td className="px-6 py-4 text-sm">
        {canChangeStatus ? (
          <button
            onClick={handleStatusToggle}
            disabled={loadingStatus}
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
              loadingStatus
                ? "cursor-wait bg-gray-100 text-gray-500"
                : statusInfo.color
            }`}
          >
            {loadingStatus ? "Updating..." : statusInfo.buttonLabel}
          </button>
        ) : (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${statusInfo.color.replace("hover:", "")}`}
          >
            {statusInfo.displayLabel}
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        <div className="max-w-[150px] truncate font-medium">
          {contest.flip_amount}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        <div className="max-w-[150px] truncate font-medium">
          {contest.sponsored_name}
        </div>
      </td>
      <td className="px-6 py-4 text-sm">
        <div className="flex items-center justify-center space-x-1">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onView?.(contest)}
            title="View Contest"
          >
            <Eye className="h-4 w-4" />
          </Button>

          {["upcoming", "draft"].includes(category || "") && (
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
              variant="secondary"
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
