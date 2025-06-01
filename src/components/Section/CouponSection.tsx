import React, { useState } from "react";
import { Plus } from "lucide-react";
import FormSection from "../FormSection";
import CouponList from "../List/CouponList";
import Button from "../Button";
import { Coupon } from "@/types/coupon";
import CouponModal from "../Modal/CouponModal";
import { useModal } from "@/hooks/useModal";

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
  const addCouponModal = useModal();
  const editCouponModal = useModal();
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const handleCouponView = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsViewMode(true);
    editCouponModal.open();
  };

  const handleCouponEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsViewMode(false);
    editCouponModal.open();
  };

  return (
    <FormSection
      title="Coupons"
      headerAction={
        <Button variant="secondary" size="sm" onClick={addCouponModal.open}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      }
    >
      <CouponList
        coupons={coupons}
        onView={handleCouponView}
        onEdit={handleCouponEdit}
        onDelete={onDelete}
        rowCount={rowCount}
        onPaginationModelChange={onPaginationModelChange}
      />

      <CouponModal
        isOpen={addCouponModal.isOpen}
        onClose={addCouponModal.close}
        onSave={onSave}
      />

      <CouponModal
        isOpen={editCouponModal.isOpen}
        onClose={editCouponModal.close}
        couponData={selectedCoupon}
        isViewMode={isViewMode}
        onSave={onSave}
      />
    </FormSection>
  );
};

export default CouponSection;