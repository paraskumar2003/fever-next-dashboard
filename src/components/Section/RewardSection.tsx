import React from "react";
import { Plus } from "lucide-react";
import FormSection from "../FormSection";
import RewardList from "../List/RewardList";
import Button from "../Button";
import { Reward } from "@/types/rewards";

interface RewardSectionProps {
  rewards: Reward[];
  onView: (reward: Reward) => void;
  onEdit: (reward: Reward) => void;
  onDelete: (id: string) => void;
  rowCount: number;
  onPaginationModelChange: (page: number) => void;
  onSave: () => Promise<void>;
}

const RewardSection: React.FC<RewardSectionProps> = ({
  rewards,
  onView,
  onEdit,
  onDelete,
  rowCount,
  onPaginationModelChange,
  onSave,
}) => {
  return (
    <FormSection
      title="Rewards"
      headerAction={
        <Button variant="secondary" size="sm" onClick={onSave}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      }
    >
      <RewardList
        rewards={rewards}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        rowCount={rowCount}
        onPaginationModelChange={onPaginationModelChange}
      />
    </FormSection>
  );
};

export default RewardSection;