import React, { useEffect, useState } from "react";
import FormSection from "@/components/FormSection";
import FormSelect from "@/components/FormSelect";
import FormInput from "@/components/FormInput";
import { ContestFormData } from "@/types";
import { RewardServices } from "@/services/rewards/reward";
import Notiflix from "notiflix";

interface OnlyWinnersFormProps {
  formData: Partial<ContestFormData>;
  updateFormData: (data: Partial<ContestFormData>) => void;
  onSave: Function;
  errors: Record<string, any>;
}

const OnlyWinnersForm: React.FC<OnlyWinnersFormProps> = ({
  formData,
  updateFormData,
  onSave,
  errors,
}) => {
  const [rewards, setRewards] = useState<any[]>([]);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const { winners, contestPrizes } = formData;

  // Helper function to check for duplicate reward IDs
  const checkForDuplicateRewardIds = (winnersArray: typeof winners) => {
    if (!winnersArray || winnersArray.length <= 1) {
      setDuplicateError(null);
      return;
    }

    const rewardIds = winnersArray
      .map((winner) => winner.reward_id)
      .filter((id) => id);
    const duplicateIds = rewardIds.filter(
      (id, index) => rewardIds.indexOf(id) !== index,
    );

    if (duplicateIds.length > 0) {
      const duplicateRewardNames = duplicateIds.map((id) => {
        const reward = rewards.find((r) => r.id === id);
        return reward ? reward.name : `ID: ${id}`;
      });
      // setDuplicateError(
      //   `Duplicate rewards detected: ${duplicateRewardNames.join(", ")}. Each reward can only be assigned once.`,
      // );
    } else {
      setDuplicateError(null);
    }
  };

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

  // Check for duplicates whenever winners array changes
  useEffect(() => {
    if (rewards.length > 0) {
      // checkForDuplicateRewardIds(winners);
    }
  }, [winners, rewards]);

  const handleWinnerCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value);
    if (winners) {
      const newWinners = Array.from({ length: count }, (_, index) => ({
        reward_id: winners[index]?.reward_id,
        bucks: winners[index]?.bucks || 0,
        qty: winners[index]?.qty,
        fever_bucks: false,
      }));
      updateFormData({ winners: newWinners });
      // Check for duplicates after updating winners array
      setTimeout(() => checkForDuplicateRewardIds(newWinners), 0);
    }
  };

  const updateWinner = (
    index: number,
    data: Partial<{
      reward_id: number;
      bucks: number;
      qty: number;
      reward_type: string;
    }>,
  ) => {
    if (winners) {
      const updated = [...winners];
      updated[index] = { ...updated[index], ...data };
      updateFormData({ winners: updated });
      // Check for duplicates after updating winner
      setTimeout(() => checkForDuplicateRewardIds(updated), 0);
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
      {/* Duplicate Error Alert */}
      {duplicateError && (
        <div className="mb-4 rounded-md border border-red-500 bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Duplicate Reward Selection
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{duplicateError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        {winners && (
          <FormSelect
            label="Types of Rewards"
            value={winners.length.toString()}
            options={Array.from({ length: 101 }, (_, i) => ({
              value: i.toString(),
              label: `${i}`,
            }))}
            onChange={handleWinnerCountChange}
            required
            error={errors?.["winners"]}
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
                Reward Type {index + 1}
              </h3>

              <FormSelect
                label="Select Reward"
                value={winner.reward_id?.toString() || ""}
                options={[
                  { value: "", label: "Select a reward" },
                  ...rewards.map((reward) => {
                    let isSelectedInAnother = false;
                    if (formData.winners)
                      isSelectedInAnother = formData.winners.some(
                        (w, i) => i !== index && w.reward_id === reward.id,
                      );
                    return {
                      value: reward.id.toString(),
                      label: `${reward.name} (${reward.reward_type})`,
                      disabled: isSelectedInAnother,
                    };
                  }),
                ]}
                onChange={(e) =>
                  updateWinner(index, {
                    reward_id: Number(e.target.value),
                    reward_type: rewards.find((r) => r.id == e.target.value)
                      .reward_type,
                  })
                }
                required
                error={errors[`winners[${index}].reward_id`]}
              />

              <FormInput
                label="Quantity"
                type="number"
                min="0"
                value={winner.qty?.toString() || "0"}
                onChange={(e) =>
                  updateWinner(index, { qty: Number(e.target.value) })
                }
                required
                error={errors[`winners[${index}].qty`]}
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
                  error={errors[`winners[${index}].bucks`]}
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
