import React, { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import Button from "../Button";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import { Save, X } from "lucide-react";
import { CouponServices } from "@/services/rewards/coupon";
import { buildCouponFormData } from "@/lib/utils/rewards/formbuilder";
import Notiflix from "notiflix";
import { RewardServices } from "@/services/rewards/reward";
import { Reward } from "@/types/rewards";

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
  const [rewards, setRewards] = useState<Reward[]>([]);

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
    const fetchRewards = async () => {
      try {
        const { data } = await RewardServices.getRewards({ pageSize: 100 });
        if (data?.data?.rows) {
          setRewards(data.data.rows);
        }
      } catch (error) {
        console.error("Error fetching rewards:", error);
      }
    };

    fetchRewards();
  }, []);

  useEffect(() => {
    if (couponData) {
      setFormData({
        ...formData,
        brand_name: couponData?.reward?.brand_name || "",
        coupon_code: couponData.coupon_code || "",
        coupon_pin: couponData.coupon_pin || "",
        status: couponData.status,
        couponTypeId: couponData.type === "code" ? "2" : "1",
        rewardId: couponData?.reward?.id || 1,
        coupon_attachment: couponData.coupon_attachment,
      });
    } else {
      setFormData({
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
      let res: any;
      if (couponData?.id) {
        res = await CouponServices.updateCoupon(couponData.id, formDataToSend);
        if (res.data) Notiflix.Notify.success("Coupon updated successfully!");
      } else {
        res = await CouponServices.createCoupon(formDataToSend);

        if (res.data) Notiflix.Notify.success("Coupon created successfully!");
      }

      if (res.data) {
        setFormData({
          brand_name: "",
          rewardId: 1,
          couponTypeId: "1",
          coupon_code: "",
          coupon_pin: "",
          status: 1,
          coupon_attachment: undefined,
        });

        if (onSave) {
          await onSave();
        }
        onClose();
      }
    } catch (error) {
      console.error("Error saving coupon:", error);
      Notiflix.Notify.failure(
        couponData?.id ? "Failed to update coupon" : "Failed to create coupon",
      );
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

  useEffect(() => {
    console.log({ formData });
  }, [formData]);

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
              label="Reward"
              value={formData.rewardId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  rewardId: parseInt(e.target.value),
                })
              }
              options={[
                { value: "", label: "Select Coupon Type" },
                ...rewards.map((type) => ({
                  value: type.id,
                  label: type.name,
                })),
              ]}
              disabled={isViewMode}
              required
            />

            <FormSelect
              label="Coupon Type"
              value={formData.couponTypeId}
              onChange={(e) =>
                setFormData({ ...formData, couponTypeId: e.target.value })
              }
              options={[
                { value: "", label: "Select Coupon Type" },
                { value: "1", label: "PDF" },
                { value: "2", label: "Code" },
              ]}
              disabled={isViewMode}
              required
            />

            {formData.couponTypeId == "2" && (
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
            )}

            {formData.couponTypeId == "2" && (
              <FormInput
                label="Coupon PIN"
                value={formData.coupon_pin}
                onChange={(e) =>
                  setFormData({ ...formData, coupon_pin: e.target.value })
                }
                placeholder="Enter coupon PIN"
                disabled={isViewMode}
              />
            )}

            {formData.couponTypeId == "1" && (
              <FormInput
                type="file"
                label="Coupon Attachment"
                onChange={handleFileChange}
                disabled={isViewMode}
                accept="image/*,.pdf"
                required={!couponData?.id}
              />
            )}

            <>
              {couponData?.coupon_attachment && (
                <div style={{ marginTop: "8px" }}>
                  <a
                    href={couponData.coupon_attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button
                      type="button"
                      className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      Download Attachment
                    </button>
                  </a>
                </div>
              )}
            </>

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
                {loading
                  ? "Saving..."
                  : couponData?.id
                    ? "Update Coupon"
                    : "Save Coupon"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CouponModal;
