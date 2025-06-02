import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Button from "../Button";
import { Coupon } from "@/types/coupon";
import moment from "moment";

interface CouponRowProps {
  coupon: Coupon;
  index: number;
  onEdit?: (coupon: Coupon) => void;
  onDelete?: (id: number) => void;
  onView?: (coupon: Coupon) => void;
}

const CouponRow: React.FC<CouponRowProps> = ({
  coupon,
  index,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <tr className="transition-colors hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-600">#{index + 1}</td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="font-medium">{coupon.brand_name}</div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{coupon.coupon_code}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{coupon.type}</td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
            coupon.status === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {coupon.status}
        </span>
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
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete?.(coupon.id)}
            title="Delete Coupon"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default CouponRow;