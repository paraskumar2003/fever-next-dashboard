import React, { useState } from "react";
import axios from "axios";
import Button from "../Button";
import FormInput from "../FormInput";
import FormTextarea from "../FormTextarea";
import FormSection from "../FormSection";
import { Save, Plus, Trash2 } from "lucide-react";

interface InstructionData {
  title: string;
  description: string;
}

const OnlyInstructionForm = () => {
  const [instructions, setInstructions] = useState<InstructionData[]>([
    {
      title: "",
      description: "",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const updatedInstructions = [...instructions];
    updatedInstructions[index] = {
      ...updatedInstructions[index],
      [name]: value,
    };
    setInstructions(updatedInstructions);
  };

  const addInstruction = () => {
    setInstructions([
      ...instructions,
      {
        title: "",
        description: "",
      },
    ]);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      const updatedInstructions = instructions.filter((_, i) => i !== index);
      setInstructions(updatedInstructions);
    }
  };

  const validateForm = () => {
    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];

      if (instruction.title && instruction.title.length < 3) {
        setError(`Instruction ${i + 1}: Title must be at least 3 characters`);
        return false;
      }

      if (instruction.title && instruction.title.length > 255) {
        setError(`Instruction ${i + 1}: Title must not exceed 255 characters`);
        return false;
      }

      if (instruction.description && instruction.description.length < 3) {
        setError(
          `Instruction ${i + 1}: Description must be at least 3 characters`,
        );
        return false;
      }

      if (instruction.description && instruction.description.length > 1000) {
        setError(
          `Instruction ${i + 1}: Description must not exceed 1000 characters`,
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const apiPayload = {
        instructions: instructions.filter(
          (instruction) =>
            instruction.title.trim() || instruction.description.trim(),
        ),
      };

      const response = await axios.post(
        "https://v3api.countrygame.live/v1/trivia/create-instructions",
        apiPayload,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6bnVsbCwic3ViIjoiMzUiLCJpYXQiOjE3MjkzNTIwNjF9.A0smZ9tH6-57r5fqEK4vNc-e4tS2pwFuV6MZp5FixA0",
            "Content-Type": "application/json",
          },
        },
      );

      setSuccess(true);
      console.log("Instructions created:", response.data);

      // Reset form
      setInstructions([
        {
          title: "",
          description: "",
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error submitting instructions:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md border border-red-500 bg-red-500/20 p-4 text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-md border border-green-500 bg-green-500/20 p-4 text-green-200">
            Instructions created successfully!
          </div>
        )}

        {instructions.map((instructionData, index) => (
          <FormSection key={index} title={`Instruction ${index + 1}`}>
            <div className="mb-4 flex justify-end">
              {instructions.length > 1 && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeInstruction(index)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Instruction
                </Button>
              )}
            </div>

            <FormInput
              label="Title (optional)"
              name="title"
              value={instructionData.title}
              onChange={(e) => handleInputChange(index, e)}
              placeholder="Enter instruction title"
              minLength={3}
              maxLength={255}
            />

            <FormTextarea
              label="Description (optional)"
              name="description"
              value={instructionData.description}
              onChange={(e) => handleInputChange(index, e)}
              placeholder="Enter instruction description"
              rows={4}
              minLength={3}
              maxLength={1000}
            />
          </FormSection>
        ))}

        <div className="flex items-center justify-between">
          <Button type="button" variant="secondary" onClick={addInstruction}>
            <Plus className="mr-2 h-4 w-4" />
            Add Another Instruction
          </Button>

          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Creating..." : "Create Instructions"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OnlyInstructionForm;
