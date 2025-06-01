import React from "react";
import { Plus } from "lucide-react";
import FormSection from "../FormSection";
import CouponList from "../List/CouponList";
import Button from "../Button";
import { Coupon } from "@/types/coupon";

interface CouponSectionProps {
  coupons: Coupon[];
  onView: (coupon: Coupon) => void;
  onEdit: (coupon: Coupon) => void;
  onDelete: (id: number) => void;
  rowCount: number;
  onPaginationModelChange: (page: number) => void;
  onSave: () => Promise<void>;
}

const CouponSection: React.FC<CouponSectionProps> = ({
  coupons,
  onView,
  onEdit,
  onDelete,
  rowCount,
  onPaginationModelChange,
  onSave,
}) => {
  return (
    <FormSection
      title="Coupons"
      headerAction={
        <Button variant="secondary" size="sm" onClick={onSave}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      }
    >
      <CouponList
        coupons={coupons}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        rowCount={rowCount}
        onPaginationModelChange={onPaginationModelChange}
      />
    </FormSection>
  );
};

export default CouponSection;