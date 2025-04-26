import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import Button from "../Button";
import FormInput from "../FormInput";
import FormTextarea from "../FormTextarea";
import { TriviaServices } from "@/services";
import { useSearchParams } from "next/navigation";

interface InstructionData {
  id?: string;
  title: string;
  description: string;
}

interface OnlyInstructionFormProps {
  readOnly?: boolean;
  instructionData?: InstructionData;
  onSave?: (formData: InstructionData) => Promise<void>;
}

const OnlyInstructionForm: React.FC<OnlyInstructionFormProps> = ({
  readOnly = false,
  instructionData,
  onSave,
}) => {
  const searchParams = useSearchParams();
  const contest_id = searchParams.get("contest_id");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formState, setFormState] = useState<InstructionData>({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (instructionData) {
      setFormState(instructionData);
    }
  }, [instructionData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (readOnly) return;

    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formState.title?.trim()) {
      errors.push("Title is required");
    }

    if (!formState.description?.trim()) {
      errors.push("Description is required");
    }

    if (!contest_id) {
      errors.push("Contest ID is required");
    }

    if (errors.length > 0) {
      setError(errors.join(", "));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;

    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Create the payload in the required format
      const payload = {
        contestId: contest_id!,
        title: formState.title,
        description: formState.description,
      };

      // If it's a new instruction, create it
      if (!instructionData) {
        await TriviaServices.createInstruction(payload);
      }

      if (onSave) {
        await onSave(formState);
      }

      setSuccess(true);

      if (!instructionData) {
        // Reset form only for new instructions
        setFormState({
          title: "",
          description: "",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error submitting instruction:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="mb-4 rounded-md border border-red-500 bg-red-500/20 p-4 text-red-200">
          {error}
        </div>
      )}

      {success && !readOnly && (
        <div className="mb-4 rounded-md border border-green-500 bg-green-500/20 p-4 text-green-200">
          Instruction saved successfully!
        </div>
      )}

      <div className="space-y-4">
        <FormInput
          label="Title"
          name="title"
          value={formState.title}
          onChange={handleInputChange}
          placeholder="Enter instruction title"
          required
          disabled={readOnly}
        />

        <FormTextarea
          label="Description"
          name="description"
          value={formState.description}
          onChange={handleInputChange}
          placeholder="Enter instruction description"
          rows={4}
          required
          disabled={readOnly}
        />
      </div>

      {!readOnly && (
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading
              ? "Saving..."
              : instructionData
                ? "Update Instruction"
                : "Save Instruction"}
          </Button>
        </div>
      )}
    </form>
  );
};

export default OnlyInstructionForm;
