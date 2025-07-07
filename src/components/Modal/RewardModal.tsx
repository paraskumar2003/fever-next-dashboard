import React, { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import Button from "../Button";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import { Save, X } from "lucide-react";
import { RewardServices } from "@/services/rewards/reward";
import Notiflix from "notiflix";

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
  const [formData, setFormData] = useState({
    name: "",
    reward_type: "DIGITAL",
    brand_name: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (rewardData) {
      setFormData({
        name: rewardData.name || "",
        reward_type: rewardData.reward_type || "DIGITAL",
        brand_name: rewardData.brand_name || "",
      });
    } else {
      setFormData({
        name: "",
        reward_type: "DIGITAL",
        brand_name: "",
      });
    }
  }, [rewardData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewMode) return;

    setLoading(true);
    try {
      if (rewardData?.id) {
        // Update existing reward
        await RewardServices.updateReward(rewardData.id, {
          name: formData.name,
          reward_type: formData.reward_type as "DIGITAL" | "PHYSICAL",
          brand_name: formData.brand_name,
        });
        Notiflix.Notify.success("Reward updated successfully!");
      } else {
        // Create new reward
        await RewardServices.createReward({
          name: formData.name,
          reward_type: formData.reward_type as "DIGITAL" | "PHYSICAL",
          brand_name: formData.brand_name,
        });
        // Notiflix.Notify.success("Reward created successfully!");
      }

      if (onSave) {
        await onSave();
      }
      onClose();
      setFormData({
        name: "",
        reward_type: "DIGITAL",
        brand_name: "",
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
