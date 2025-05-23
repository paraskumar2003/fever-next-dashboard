import React from "react";
import FormSection from "@/components/FormSection";
import FormSelect from "@/components/FormSelect";
import FormInput from "@/components/FormInput";
import ImageUpload from "@/components/ImageUpload";
import { ContestFormData, RewardType } from "@/types";

interface OnlyWinnersFormProps {
  formData: Partial<ContestFormData>;
  updateFormData: (data: Partial<ContestFormData>) => void;
  onSave: Function;
}

const rewardTypeOptions = [
  { value: "PHYSICAL", label: "Physical" },
  { value: "COUPON_PDF", label: "Coupon PDF" },
  { value: "CODE", label: "Code" },
];

const OnlyWinnersForm: React.FC<OnlyWinnersFormProps> = ({
  formData,
  updateFormData,
  onSave,
}) => {
  const { winners, sponsor_logo = "" } = formData;

  const handleWinnerCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value);
    if (winners) {
      const newWinners = Array.from({ length: count }, (_, index) => ({
        reward_type: winners[index]?.reward_type || "PHYSICAL",
        reward_image: winners[index]?.reward_image || "",
        reward_file: winners[index]?.reward_file || "",
      }));

      console.log(newWinners);
      updateFormData({ winners: newWinners });
    }
  };

  const updateWinner = (
    index: number,
    data: Partial<ContestFormData["winners"][0]>,
  ) => {
    if (winners) {
      const updated = [...winners];
      updated[index] = { ...updated[index], ...data };
      updateFormData({ winners: updated });
    }
  };

  const updateSponsorLogo = (base64: string) => {
    updateFormData({ sponsor_logo: base64 });
  };

  return (
    <FormSection title="Winners & Rewards" onSave={() => onSave()}>
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
          />
        )}
      </div>

      {winners && (
        <div className="space-y-6">
          {winners.map((winner, index) => (
            <div
              key={index}
              className="rounded-lg border bg-gray-50 p-4 shadow-md"
            >
              <h3 className="mb-4 text-lg font-semibold">
                Winner #{index + 1}
              </h3>

              <FormSelect
                label="Reward Type"
                value={winner.reward_type}
                options={rewardTypeOptions}
                onChange={(e) =>
                  updateWinner(index, {
                    reward_type: e.target.value as RewardType,
                  })
                }
              />

              {(winner.reward_type === "COUPON_PDF" ||
                winner.reward_type === "CODE") && (
                <>
                  {winner.reward_type === "COUPON_PDF" ? (
                    <FormInput
                      type="file"
                      accept=".pdf"
                      label="Upload Coupon PDF"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () =>
                            updateWinner(index, {
                              reward_file: reader.result as string,
                            });
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  ) : (
                    <FormInput
                      label="Enter Voucher Code"
                      placeholder="Enter code"
                      value={winner.reward_file || ""}
                      onChange={(e) =>
                        updateWinner(index, { reward_file: e.target.value })
                      }
                    />
                  )}
                </>
              )}

              <ImageUpload
                label="Reward Image"
                value={winner.reward_image || ""}
                onChange={(base64) =>
                  updateWinner(index, { reward_image: base64 })
                }
              />
            </div>
          ))}
        </div>
      )}
    </FormSection>
  );
};

export { OnlyWinnersForm };
