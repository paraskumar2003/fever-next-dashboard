import React, { useState } from "react";
import FormSection from "@/components/FormSection";
import FormInput from "@/components/FormInput";
import ImageUpload from "@/components/ImageUpload";
import { ContestFormData, Instruction } from "@/types";

interface OnlyInstructionFormProps {
  formData: Partial<ContestFormData>;
  updateFormData: (data: Partial<ContestFormData>) => void;
  onSave: Function;
  errors: Record<string, any>;
}

const MAX_INSTRUCTIONS = 5;
const MAX_FILE_SIZE_MB = 1;
const REQUIRED_WIDTH = 200;
const REQUIRED_HEIGHT = 100;

const DEFAULT_INSTRUCTIONS: Instruction[] = [
  { title: "Step 1", description: "Predict the outcome" },
  { title: "Step 2", description: "Wait for result" },
  { title: "Step 3", description: "Claim your reward" },
];

const OnlyInstructionForm: React.FC<OnlyInstructionFormProps> = ({
  formData,
  updateFormData,
  onSave,
  errors,
}) => {
  const {
    mega_prize_name = "",
    instructions = [],
    sponsor_logo = "",
  } = formData;

  const handleMegaPrizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ mega_prize_name: e.target.value });
  };

  const handleImageChange = (base64: string) => {
    updateFormData({ sponsor_logo: base64 });
  };

  const filledInstructions: Instruction[] = [
    ...instructions,
    ...Array.from({ length: MAX_INSTRUCTIONS - instructions.length }, () => ({
      title: "",
      description: "",
    })),
  ].slice(0, MAX_INSTRUCTIONS);

  const updateInstruction = (index: number, updated: Partial<Instruction>) => {
    const newInstructions = [...filledInstructions];
    newInstructions[index] = { ...newInstructions[index], ...updated };
    updateFormData({ instructions: newInstructions });
  };

  const validateImage = async (file: File): Promise<boolean> => {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`File size should not exceed ${MAX_FILE_SIZE_MB}MB`);
      return false;
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const isValid =
          img.width === REQUIRED_WIDTH && img.height === REQUIRED_HEIGHT;
        URL.revokeObjectURL(img.src);
        if (!isValid) {
          alert(`Image must be exactly ${REQUIRED_WIDTH}x${REQUIRED_HEIGHT}px`);
        }
        resolve(isValid);
      };
    });
  };

  return (
    <FormSection title="Game Instructions" onSave={() => onSave()}>
      {errors.instructions && (
        <div className="text-red-500">{errors.instructions}</div>
      )}

      <div className="mb-6">
        <FormInput
          label="Mega Prize Title"
          placeholder="Enter Mega Prize Name"
          value={mega_prize_name}
          onChange={handleMegaPrizeChange}
          error={errors.mega_prize_name}
          required
        />
      </div>

      <div className="space-y-4">
        {filledInstructions.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border bg-gray-50 p-4 shadow-sm"
          >
            <h3 className="text-md mb-4 font-semibold">
              Instruction #{index + 1}
            </h3>

            <FormInput
              label="Title"
              placeholder="e.g., Step 1"
              value={item.title || ""}
              onChange={(e) =>
                updateInstruction(index, { title: e.target.value })
              }
              error={errors[`instructions[${index}].title`]}
              required
            />

            <FormInput
              label="Description"
              placeholder="Enter instruction detail"
              value={item.description || ""}
              onChange={(e) =>
                updateInstruction(index, { description: e.target.value })
              }
              error={errors[`instructions[${index}].description`]}
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <ImageUpload
          label="Sponsor Logo (200x100px, max 1MB)"
          value={formData.sponsor_logo_preview || ""}
          onChange={handleImageChange}
          error={errors.sponsor_logo}
          required
        />
      </div>
    </FormSection>
  );
};

export { OnlyInstructionForm };
