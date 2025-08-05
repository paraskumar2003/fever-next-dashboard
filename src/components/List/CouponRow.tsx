import React, { useState } from "react";
import { Eye, Pencil } from "lucide-react";
import Button from "../Button";
import { Coupon } from "@/types/coupon";

interface CouponRowProps {
  coupon: Coupon;
  index: number;
  onEdit?: (coupon: Coupon) => void;
  onDelete?: (id: number) => void;
  onView?: (coupon: Coupon) => void;
  onStatusChange?: (id: number, status: number) => void;
  page: number;
  pageSize: number;
}

const CouponRow: React.FC<CouponRowProps> = ({
  coupon,
  index,
  onEdit,
  onView,
  onStatusChange,
  page,
  pageSize,
}) => {
  const [loadingStatus, setLoadingStatus] = useState(false);

  const handleStatusToggle = async () => {
    setLoadingStatus(true);
    try {
      await onStatusChange?.(coupon.id, coupon.status ? 0 : 1);
    } catch (error) {
      console.error("Error updating coupon status:", error);
    } finally {
      setLoadingStatus(false);
    }
  };

  return (
    <tr className="transition-colors hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-600">
        #{(page - 1) * pageSize + index + 1}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="font-medium">{coupon?.reward?.brand_name}</div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{coupon.coupon_code}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{coupon.type}</td>
      {/* active/inactive buttons */}
      <td className="px-4 py-3 text-sm">
        <button
          onClick={handleStatusToggle}
          disabled={loadingStatus}
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            loadingStatus
              ? "cursor-wait bg-gray-100 text-gray-400"
              : coupon.status
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-red-100 text-red-700 hover:bg-red-200"
          }`}
        >
          {loadingStatus
            ? "Updating..."
            : coupon.status
              ? "Active"
              : "Inactive"}
        </button>
      </td>
      <td className="px-4 py-3 text-sm">
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onView?.(coupon)}
            title="View Coupon"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit?.(coupon)}
            title="Edit Coupon"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          {/* <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete?.(coupon.id)}
            title="Delete Coupon"
          >
            <Trash2 className="h-4 w-4" />
          </Button> */}
        </div>
      </td>
    </tr>
  );
};

export default CouponRow;
