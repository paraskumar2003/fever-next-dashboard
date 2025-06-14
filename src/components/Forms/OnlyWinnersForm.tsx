import React, { useEffect, useState } from "react";
import FormSection from "@/components/FormSection";
import FormSelect from "@/components/FormSelect";
import FormInput from "@/components/FormInput";
import { ContestFormData } from "@/types";
import { RewardServices } from "@/services/rewards/reward";
import { ContestServices } from "@/services/contest";
import Notiflix from "notiflix";

interface OnlyWinnersFormProps {
  formData: Partial<ContestFormData>;
  updateFormData: (data: Partial<ContestFormData>) => void;
  onSave: Function;
}

const OnlyWinnersForm: React.FC<OnlyWinnersFormProps> = ({
  formData,
  updateFormData,
  onSave,
}) => {
  const [rewards, setRewards] = useState<any[]>([]);
  const { winners } = formData;

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

  const handleWinnerCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value);
    if (winners) {
      const newWinners = Array.from({ length: count }, (_, index) => ({
        reward_id: winners[index]?.reward_id || parseInt(rewards[0]?.id) || 0,
        bucks: winners[index]?.bucks || 0,
      }));
      updateFormData({ winners: newWinners });
    }
  };

  const updateWinner = (
    index: number,
    data: Partial<{ reward_id: number; bucks: number }>,
  ) => {
    if (winners) {
      const updated = [...winners];
      updated[index] = { ...updated[index], ...data };
      updateFormData({ winners: updated });
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.contest_id || !winners?.length) {
        Notiflix.Notify.failure("Missing required data");
        return;
      }
      if (onSave) onSave();
    } catch (error) {
      console.error("Error saving contest prizes:", error);
      Notiflix.Notify.failure("Failed to save contest prizes");
    }
  };

  return (
    <FormSection title="Winners & Rewards" onSave={handleSubmit}>
      <div className="mb-6">
        {winners && (
          <FormSelect
            label="Winners Count"
            value={winners.length.toString()}
            options={Array.from({ length: 100 }, (_, i) => ({
              value: (i + 1).toString(),
              label: `${i + 1}`,
            }))}
            onChange={handleWinnerCountChange}
            required
          />
        )}
      </div>

      {formData?.winners && (
        <div className="space-y-6">
          {formData?.winners.map((winner, index) => (
            <div
              key={index}
              className="rounded-lg border bg-gray-50 p-4 shadow-md"
            >
              <h3 className="mb-4 text-lg font-semibold">
                Winner #{index + 1}
              </h3>

              <FormSelect
                label="Select Reward"
                value={winner.reward_id?.toString() || ""}
                options={[
                  { value: "", label: "Select a reward" },
                  ...rewards.map((reward) => ({
                    value: reward.id.toString(),
                    label: `${reward.name} (${reward.reward_type})`,
                  })),
                ]}
                onChange={(e) =>
                  updateWinner(index, {
                    reward_id: Number(e.target.value),
                  })
                }
                required
              />

              {rewards.find((r) => r.id == Number(winner.reward_id))
                ?.reward_type === "FEVER_BUCKS" && (
                <FormInput
                  label="Fever Bucks Amount"
                  type="number"
                  min="0"
                  value={winner.bucks?.toString() || "0"}
                  onChange={(e) =>
                    updateWinner(index, { bucks: Number(e.target.value) })
                  }
                  required
                />
              )}
            </div>
          ))}
        </div>
      )}
    </FormSection>
  );
};

export { OnlyWinnersForm };
