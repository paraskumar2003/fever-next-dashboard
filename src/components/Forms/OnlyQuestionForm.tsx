import React, { useEffect, useState } from "react";
import FormSection from "@/components/FormSection";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { ContestFormData, QuestionSet } from "@/types";
import {
  CategoryServices,
  QuestionSetServices,
  TriviaServices,
} from "@/services";

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    String(formData.QuestionCategoryId)! || null,
  );
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [categories, setCategories] = useState<QuestionSet[]>([]);
  const [sets, setSets] = useState<QuestionSet[]>([]);
  const [selectedFlipSet, setSelectedFlipSet] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [flipSetError, setFlipSetError] = useState<string>("");

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

    const selected = categories.find(
      (c: any) => c.id == formData?.QuestionCategoryId,
    );
    if (selected) setSelectedCategory(String(selected.id));
    if (formData.questions && selected) {
      if (parseInt(selected.questions) < updatedQuestions?.length)
        setError(`Please choose a set with at least ${count} questions.`);
      else {
        updateFormData({ questions: updatedQuestions });
        setError("");
      }
    } else {
      setError("");
    }
  };

  // Example fetch function for question sets
  const fetchQuestionSets = async () => {
    // Replace with actual API call to fetch sets
    const res = await CategoryServices.getCategoroiesWithCount();
    let categoriesData = res.data?.data;
    if (categoriesData) {
      setCategories(
        categoriesData?.map((e: Record<string, any>) => ({
          ...e,
          name: e.category,
        })),
      );
      formData.QuestionCategoryId ??= categoriesData[0].id;
    }
  };

  useEffect(() => {
    fetchQuestionSets();
  }, []);

  useEffect(() => {
    if (+selectedCategory!) fetchSets();
  }, [selectedCategory]);

  const fetchSets = async () => {
    // Replace with actual API call to fetch sets
    const res = await QuestionSetServices.getQuestionSetsByCategoryId(
      +selectedCategory!,
    );
    let setsData = res.data?.data?.rows;
    if (setsData) {
      setSets(
        setsData?.map((e: Record<string, any>) => ({
          ...e,
          name: e.name,
        })),
      );
      formData.QuestionCategoryId ??= setsData[0].id;
    }
  };

  const handleCategorySelection = (categoryId: string) => {
    const selected = categories.find((c: any) => c.id == categoryId);
    if (!selected) {
      throw new Error("Invalid setId!!");
    }

    if (!formData.questions) {
      throw new Error("Invalid question value in form!!");
    }
    if (formData.questions && selected) {
      if (parseInt(selected.questions as string) < formData.questions?.length)
        setError(
          `Please choose a set with at least ${formData.questions?.length} questions.`,
        );
      else {
        updateFormData({
          QuestionCategoryId: selected.id,
        });
        setSelectedCategory(String(selected.id));
      }
    } else {
      setError("");
    }
  };

  const handleSetSelection = (setId: string) => {
    const selected = sets.find((set: any) => set.id == setId);
    if (!selected) {
      throw new Error("Invalid setId!!");
    }

    if (!formData.questions) {
      throw new Error("Invalid question value in form!!");
    }
    console.log(
      formData.questions,
      selected,
      parseInt(selected?.questions as string) < formData?.questions?.length,
    );
    if (formData.questions && selected) {
      if (parseInt(selected.questions as string) < formData.questions?.length)
        setError(
          `Please choose a set with at least ${formData.questions?.length} questions.`,
        );
      else {
        updateFormData({
          set_id: selected.id,
        });
        setSelectedSet(String(selected.id));
      }
    } else {
      setError("");
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
          error={errors.questions}
          required
        />
      </div>

      <div className="mb-6">
        <FormSelect
          label="Choose Category"
          value={formData.QuestionCategoryId}
          options={categories.map((category: any) => ({
            value: category.id,
            label: `${category.name}`,
          }))}
          onChange={(e) => handleCategorySelection(e.target.value)}
          error={errors.QuestionCategoryId}
          required
        />
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      </div>

      <div className="mb-6">
        <FormSelect
          label="Choose Set"
          value={formData.set_id}
          options={sets.map((set: any) => ({
            value: set.id,
            label: `${set.name}`,
          }))}
          onChange={(e) => handleSetSelection(e.target.value)}
          error={errors.set_id}
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
          error={errors.game_time_level}
          required
        />
      </div>

      {formData.game_time_level === "GAME" ? (
        <FormInput
          label="Game Timer (in seconds)"
          type="number"
          value={formData.game_timer || ""}
          onChange={(e) => updateFormData({ game_timer: e.target.value })}
          error={errors.game_timer}
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
              error={errors[`questions[${index}]`]?.timer}
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
          error={errors.flip_allowed}
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
              error={errors.flip_count}
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
              error={errors.flip_fee}
            />

            <div className="mb-6">
              <FormSelect
                label="Choose Flip Set"
                value={formData.flipSet || ""}
                options={sets
                  .filter((e) => e.id != formData.QuestionCategoryId)
                  .map((set: any) => ({
                    value: set.id,
                    label: `${set.name}`,
                  }))}
                onChange={(e) => handleFlipSetSelection(e.target.value)}
                error={errors.flipSet}
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
