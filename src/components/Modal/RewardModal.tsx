import React, { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import Button from "../Button";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import FormTextarea from "../FormTextarea";
import { Save, X } from "lucide-react";
import { RewardServices } from "@/services/rewards/reward";
import Notiflix from "notiflix";
import { strict } from "assert";
import { string } from "yup";
import ImageUpload from "../ImageUpload";

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewardData?: any;
  isViewMode?: boolean;
  onSave?: () => Promise<void>;
}

const RewardModal: React.FC<RewardModalProps> = ({
  isOpen,
  onClose,
  rewardData,
  isViewMode = false,
  onSave,
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    reward_type: string;
    brand_name: string;
    description: string;
    logo?: File | null;
    logo_preview?: string;
  }>({
    name: "",
    reward_type: "DIGITAL",
    brand_name: "",
    description: "",
    logo: null as File | null, // 👈 store File here,
    logo_preview: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log({ formData });
  }, [formData]);

  useEffect(() => {
    if (rewardData) {
      setFormData({
        name: rewardData.name || "",
        reward_type: rewardData.reward_type || "DIGITAL",
        brand_name: rewardData.brand_name || "",
        description: rewardData.description || "",
        logo_preview: rewardData.logo || "",
      });
    } else {
      setFormData({
        name: "",
        reward_type: "DIGITAL",
        brand_name: "",
        description: "",
      });
    }
  }, [rewardData]);

  // ✅ Utility to build FormData
  function buildRewardFormData(formData: any) {
    const fd = new FormData();

    if (formData.name) fd.append("name", formData.name);
    if (formData.reward_type) fd.append("reward_type", formData.reward_type);
    if (formData.brand_name) fd.append("brand_name", formData.brand_name);
    if (formData.description) fd.append("description", formData.description);
    if (formData.logo instanceof File)
      fd.append("logo", formData.logo, formData.logo.name);

    return fd;
  }

  // ✅ Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewMode) return;

    setLoading(true);
    try {
      const fd = buildRewardFormData(formData);

      if (rewardData?.id) {
        // Update existing reward
        await RewardServices.updateReward(rewardData.id, fd);
        Notiflix.Notify.success("Reward updated successfully!");
      } else {
        // Create new reward
        await RewardServices.createReward(fd);
        Notiflix.Notify.success("Reward created successfully!");
      }

      if (onSave) {
        await onSave();
      }
      onClose();
      setFormData({
        name: "",
        reward_type: "DIGITAL",
        brand_name: "",
        description: "",
      });
    } catch (error) {
      console.error("Error saving reward:", error);
      Notiflix.Notify.failure(
        rewardData?.id ? "Failed to update reward" : "Failed to create reward",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (field: "logo", base64: string) => {
    const byteString = atob(base64.split(",")[1]);
    const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const file = new File([ab], `${field}.${mimeString.split("/")[1]}`, {
      type: mimeString,
    });

    setFormData((prev) => ({
      ...prev,
      [field]: file,
      [`${field}_preview`]: base64,
    }));
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="reward-modal-title"
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
            id="reward-modal-title"
          >
            {isViewMode
              ? "View Reward"
              : rewardData
                ? "Edit Reward"
                : "Add Reward"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <FormInput
              label="Reward Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter reward name"
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

            <FormTextarea
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter reward description"
              disabled={isViewMode}
              rows={4}
            />

            <FormSelect
              label="Reward Type"
              value={formData.reward_type}
              onChange={(e) =>
                setFormData({ ...formData, reward_type: e.target.value })
              }
              options={[
                { value: "DIGITAL", label: "Digital" },
                { value: "PHYSICAL", label: "Physical" },
              ]}
              disabled={isViewMode}
            />
          </div>

          <div className="mt-6">
            <ImageUpload
              label="Reward Logo"
              value={formData.logo_preview || ""}
              onChange={(base64) => handleImageChange("logo", base64)}
              required
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
                  : rewardData?.id
                    ? "Update Reward"
                    : "Save Reward"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default RewardModal;
