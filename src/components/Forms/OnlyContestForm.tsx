"use client";
import React from "react";
import FormSection from "@/components/FormSection";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import ImageUpload from "@/components/ImageUpload";
import { ContestFormData } from "@/types";

interface OnlyContestFormProps {
  formData: Partial<ContestFormData>;
  updateFormData: (data: Partial<ContestFormData>) => void;
  onSave: Function;
}

const OnlyContestForm: React.FC<OnlyContestFormProps> = ({
  formData,
  updateFormData,
  onSave,
}) => {
  return (
    <FormSection title="Contest Details" onSave={() => onSave(formData)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInput
          label="Contest Name"
          placeholder="Enter contest name"
          value={formData.contest_name || ""}
          onChange={(e) => updateFormData({ contest_name: e.target.value })}
        />
        <FormInput
          label="Reward Name"
          placeholder="Enter reward name"
          value={formData.reward_name || ""}
          onChange={(e) => updateFormData({ reward_name: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <FormInput
            label="Start Date"
            type="date"
            value={formData.start_date || ""}
            onChange={(e) => updateFormData({ start_date: e.target.value })}
          />
        </div>
        <div>
          <FormInput
            label="Start Time"
            type="time"
            value={formData.start_time || ""}
            onChange={(e) => updateFormData({ start_time: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <FormInput
            label="End Date"
            type="date"
            value={formData.end_date || ""}
            onChange={(e) => updateFormData({ end_date: e.target.value })}
          />
        </div>
        <div>
          <FormInput
            label="End Time"
            type="time"
            value={formData.end_time || ""}
            onChange={(e) => updateFormData({ end_time: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormSelect
          label="Contest Type"
          options={[
            { value: "FREE", label: "Free" },
            { value: "PAID", label: "Paid" },
          ]}
          value={formData.contest_type || "FREE"}
          onChange={(e) =>
            updateFormData({ contest_type: e.target.value as "FREE" | "PAID" })
          }
        />
        {formData.contest_type === "PAID" && (
          <FormInput
            label="Contest Fee"
            type="number"
            min="1"
            placeholder="Enter contest fee"
            value={formData.contest_fee?.toString() || ""}
            onChange={(e) =>
              updateFormData({ contest_fee: parseInt(e.target.value) })
            }
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInput
          label="Contest Type Name (Optional)"
          placeholder="E.g., Premium, Standard"
          value={formData.contest_type_name || ""}
          onChange={(e) =>
            updateFormData({ contest_type_name: e.target.value })
          }
        />
        <FormInput
          label="Contest Variant Name (Optional)"
          placeholder="E.g., Summer Edition"
          value={formData.contest_variant_name || ""}
          onChange={(e) =>
            updateFormData({ contest_variant_name: e.target.value })
          }
        />
      </div>

      <FormInput
        label="Sponsor Name"
        placeholder="Enter sponsor name"
        value={formData.sponsor_name || ""}
        onChange={(e) => updateFormData({ sponsor_name: e.target.value })}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ImageUpload
          label="Sponsor Logo"
          value={formData.sponsor_logo_preview || ""}
          onChange={(base64) => updateFormData({ sponsor_logo: base64 })}
        />
        <ImageUpload
          label="Thumbnail"
          value={formData.thumbnail_preview || ""}
          onChange={(base64) => updateFormData({ thumbnail: base64 })}
        />
        <ImageUpload
          label="Contest Image"
          value={formData.contest_image_preview || ""}
          onChange={(base64) => updateFormData({ contest_image: base64 })}
        />
        <ImageUpload
          label="Contest Hero Logo"
          value={formData.contest_hero_logo_preview || ""}
          onChange={(base64) => updateFormData({ contest_hero_logo: base64 })}
        />
      </div>
    </FormSection>
  );
};

export default OnlyContestForm;
