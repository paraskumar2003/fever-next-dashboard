import React, { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import Button from "../Button";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import { Save, X } from "lucide-react";
import { CouponServices } from "@/services/rewards/coupon";
import { buildCouponFormData } from "@/lib/utils/rewards/formbuilder";
import Notiflix from "notiflix";

interface CouponType {
  id: string;
  name: string;
}

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  couponData?: any;
  isViewMode?: boolean;
  onSave?: () => Promise<void>;
}

const CouponModal: React.FC<CouponModalProps> = ({
  isOpen,
  onClose,
  couponData,
  isViewMode = false,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    type: "plain",
    brand_name: "",
    rewardId: 1,
    couponTypeId: "1",
    coupon_code: "",
    coupon_pin: "",
    status: 1,
    coupon_attachment: undefined as File | undefined,
  });

  const [loading, setLoading] = useState(false);
  const [couponTypes, setCouponTypes] = useState<CouponType[]>([]);

  useEffect(() => {
    const fetchCouponTypes = async () => {
      try {
        const { data } = await CouponServices.getCouponTypes({});
        if (data?.data) {
          setCouponTypes(data.data);
        }
      } catch (error) {
        console.error("Error fetching coupon types:", error);
        Notiflix.Notify.failure("Failed to fetch coupon types");
      }
    };

    fetchCouponTypes();
  }, []);

  useEffect(() => {
    if (couponData) {
      setFormData({
        ...formData,
        type: couponData.type || "plain",
        brand_name: couponData.brand_name || "",
        coupon_code: couponData.coupon_code || "",
        coupon_pin: couponData.coupon_pin || "",
        status: couponData.status || 1,
        couponTypeId: couponData.couponTypeId || "1",
      });
    } else {
      setFormData({
        type: "plain",
        brand_name: "",
        rewardId: 1,
        couponTypeId: "1",
        coupon_code: "",
        coupon_pin: "",
        status: 1,
        coupon_attachment: undefined,
      });
    }
  }, [couponData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewMode) return;

    setLoading(true);
    try {
      const formDataToSend = buildCouponFormData(formData);
      await CouponServices.createCoupon(formDataToSend);
      Notiflix.Notify.success("Coupon created successfully!");

      if (onSave) {
        await onSave();
      }
      onClose();
    } catch (error) {
      console.error("Error saving coupon:", error);
      Notiflix.Notify.failure("Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, coupon_attachment: file });
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="coupon-modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2
            className="text-xl font-semibold text-gray-800"
            id="coupon-modal-title"
          >
            {isViewMode
              ? "View Coupon"
              : couponData
              ? "Edit Coupon"
              : "Add Coupon"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <FormSelect
              label="Type"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              options={[
                { value: "plain", label: "Plain" },
                { value: "attachment", label: "Attachment" },
              ]}
              disabled={isViewMode}
            />

            <FormSelect
              label="Coupon Type"
              value={formData.couponTypeId}
              onChange={(e) =>
                setFormData({ ...formData, couponTypeId: e.target.value })
              }
              options={[
                { value: "", label: "Select Coupon Type" },
                ...couponTypes.map((type) => ({
                  value: type.id,
                  label: type.name,
                })),
              ]}
              disabled={isViewMode}
              required
            />

            <FormInput
              label="Brand Name"
              value={formData.brand_name}
              onChange={(e) =>
                setFormData({ ...formData, brand_name: e.target.value })
              }
              placeholder="Enter brand name"
              disabled={isViewMode}
              required
            />

            <FormInput
              label="Coupon Code"
              value={formData.coupon_code}
              onChange={(e) =>
                setFormData({ ...formData, coupon_code: e.target.value })
              }
              placeholder="Enter coupon code"
              disabled={isViewMode}
              required
            />

            <FormInput
              label="Coupon PIN"
              value={formData.coupon_pin}
              onChange={(e) =>
                setFormData({ ...formData, coupon_pin: e.target.value })
              }
              placeholder="Enter coupon PIN"
              disabled={isViewMode}
              required
            />

            <FormInput
              type="file"
              label="Coupon Attachment"
              onChange={handleFileChange}
              disabled={isViewMode}
              accept="image/*,.pdf"
              required
            />

            <FormSelect
              label="Status"
              value={formData.status.toString()}
              onChange={(e) =>
                setFormData({ ...formData, status: Number(e.target.value) })
              }
              options={[
                { value: "1", label: "Active" },
                { value: "0", label: "Inactive" },
              ]}
              disabled={isViewMode}
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            {!isViewMode && (
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Saving..." : "Save Coupon"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CouponModal;