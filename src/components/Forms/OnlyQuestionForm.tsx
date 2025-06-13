import React, { useEffect, useState } from "react";
import FormSection from "@/components/FormSection";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { Button, Typography } from "@mui/material";
import { ContestFormData, QuestionSet } from "@/types";
import { questionSets } from "./QuestionSet";
import { CategoryServices } from "@/services";

interface OnlyQuestionFormProps {
  formData: Partial<ContestFormData>;
  updateFormData: (data: Partial<ContestFormData>) => void;
  onSave: () => void;
  handleFlipSetModalOpen: () => void;
  errors: Record<string, any>;
}

const OnlyQuestionForm: React.FC<OnlyQuestionFormProps> = ({
  formData,
  updateFormData,
  onSave,
  handleFlipSetModalOpen,
  errors,
}) => {
  const handleQuestionCountChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const count = parseInt(e.target.value);
    const updatedQuestions = Array.from(
      { length: count },
      (_, i) =>
        formData.questions?.[i] || {
          question: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          correctOption: "option1" as
            | "option1"
            | "option2"
            | "option3"
            | "option4",
          timer: "10",
        },
    );
    updateFormData({ questions: updatedQuestions });
  };

  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [sets, setSets] = useState<QuestionSet[]>([]);
  const [selectedFlipSet, setSelectedFlipSet] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [flipSetError, setFlipSetError] = useState<string>("");

  // Example fetch function for question sets
  const fetchQuestionSets = async () => {
    // Replace with actual API call to fetch sets
    const res = await CategoryServices.getCategoroiesWithCount();
    let setsData = res.data?.data;
    if (setsData) {
      setSets(
        setsData?.map((e: Record<string, any>) => ({
          ...e,
          name: e.category,
        })),
      );
      updateFormData({
        QuestionCategoryId: parseInt(setsData[0].id),
        flipSet: parseInt(setsData[0].id),
      });
    }
  };

  useEffect(() => {
    fetchQuestionSets(); // Fetch the sets when component mounts
  }, []);

  const handleSetSelection = (setId: string) => {
    const selected = sets.find((set: any) => set.id == setId);
    console.log(selected?.questions, selected, formData.questions, setId, sets);
    if (
      formData.questions &&
      selected &&
      selected.questions < formData.questions?.length
    ) {
      setError(
        `Please choose a set with at least ${formData.questions?.length} questions.`,
      );
    } else {
      setError("");
      setSelectedSet(setId); // Valid set, proceed to set it
      updateFormData({
        QuestionCategoryId: parseInt(setId),
      });
    }
  };

  const handleFlipSetSelection = (setId: string) => {
    const selected = sets.find((set: any) => set.id == setId);
    if (
      formData.questions &&
      selected &&
      selected.id === formData.QuestionCategoryId
    ) {
      setFlipSetError(
        `Please choose a set different from set selected for questions.`,
      );
    } else {
      setFlipSetError("");
      setSelectedFlipSet(setId); // Valid set, proceed to set it
      updateFormData({
        flipSet: parseInt(setId),
      });
    }
  };

  return (
    <FormSection title="Game Questions" onSave={onSave}>
      <div className="mb-6">
        <FormSelect
          label="Number of Questions"
          value={formData.questions?.length?.toString() || "1"}
          options={Array.from({ length: 100 }, (_, i) => ({
            value: (i + 1).toString(),
            label: `${i + 1}`,
          }))}
          onChange={handleQuestionCountChange}
          required
        />
      </div>

      <div className="mb-6">
        <FormSelect
          label="Choose Set"
          value={selectedSet || ""}
          options={sets.map((set: any) => ({
            value: set.id,
            label: `${set.name}`,
          }))}
          onChange={(e) => handleSetSelection(e.target.value)}
          required
        />
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      </div>

      <div className="mb-6">
        <FormSelect
          label="Game Time Level"
          value={formData.game_time_level || "GAME"}
          options={[
            { value: "GAME", label: "Game" },
            { value: "QUESTION", label: "Question" },
          ]}
          onChange={(e) =>
            updateFormData({
              game_time_level: e.target.value as "GAME" | "QUESTION",
            })
          }
          required
        />
      </div>

      {formData.game_time_level === "GAME" ? (
        <FormInput
          label="Game Timer (in seconds)"
          type="number"
          value={formData.game_timer || ""}
          onChange={(e) => updateFormData({ game_timer: e.target.value })}
          required
        />
      ) : (
        <div className="space-y-4">
          {formData.questions?.map((q, index) => (
            <FormInput
              key={index}
              label={`Question ${index + 1} Timer (in seconds)`}
              type="number"
              value={q.timer}
              onChange={(e) => {
                const questions = [...(formData.questions || [])];
                questions[index].timer = e.target.value;
                updateFormData({ questions });
              }}
              required
            />
          ))}
        </div>
      )}

      <div className="mt-6">
        <FormSelect
          label="Question Flip Allowed"
          value={formData.flip_allowed}
          options={[
            { value: "1", label: "Yes" },
            { value: "0", label: "No" },
          ]}
          onChange={(e) =>
            updateFormData({ flip_allowed: Number(e.target.value) })
          }
          required
        />
      </div>

      <span>
        {Boolean(formData.flip_allowed) && (
          <div className="mt-4 space-y-4">
            <FormSelect
              label="No. of Flips Allowed"
              value={formData.flip_count?.toString() || "1"}
              options={Array.from({ length: 50 }, (_, i) => ({
                value: (i + 1).toString(),
                label: `${i + 1}`,
              }))}
              onChange={(e) =>
                updateFormData({ flip_count: parseInt(e.target.value) })
              }
              required
            />

            <FormInput
              label="Flip Fee"
              type="number"
              value={formData.flip_fee || ""}
              onChange={(e) =>
                updateFormData({ flip_fee: parseInt(e.target.value) })
              }
              required
            />

            <div className="mb-6">
              <FormSelect
                label="Choose Flip Set"
                value={selectedFlipSet || ""}
                options={sets.map((set: any) => ({
                  value: set.id,
                  label: `${set.name}`,
                }))}
                onChange={(e) => handleFlipSetSelection(e.target.value)}
                required
              />
              {flipSetError && (
                <p className="mt-2 text-xs text-red-500">{flipSetError}</p>
              )}
            </div>
          </div>
        )}
      </span>
    </FormSection>
  );
};

export { OnlyQuestionForm };
