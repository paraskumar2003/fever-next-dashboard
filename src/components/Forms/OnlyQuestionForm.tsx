import React, { useEffect, useState } from "react";
import FormSection from "@/components/FormSection";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { ContestFormData, QuestionSet } from "@/types";
import { CategoryServices, QuestionSetServices } from "@/services";

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
  errors,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    String(formData.QuestionCategoryId)! || null,
  );
  const [categories, setCategories] = useState<QuestionSet[]>([]);
  const [sets, setSets] = useState<QuestionSet[]>([]);

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
    updateFormData({
      questions: updatedQuestions,
      QuestionCount: updatedQuestions.length,
    });
  };

  const fetchQuestionCategories = async () => {
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
      formData.QuestionCount ??= Number(categoriesData[0].questions);
      formData.noOfQuestionInCurrentCategory ??= Number(
        categoriesData[0].questions,
      );
    }
  };

  useEffect(() => {
    fetchQuestionCategories();
  }, []);

  useEffect(() => {
    if (+selectedCategory!) fetchSets();
  }, [selectedCategory]);

  const fetchSets = async () => {
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
      formData.QuestionCount ??= setsData[0].questions.length;
      formData.noOfQuestionInCurrentSet ??= setsData[0].questions.length;
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
      updateFormData({
        QuestionCategoryId: selected.id,
        noOfQuestionInCurrentCategory: Number(selected.questions),
      });
      setSelectedCategory(String(selected.id));
    }
  };

  const handleSetSelection = (setId: string) => {
    const selected = sets.find((set: any) => set.id == setId);
    if (formData.questions && selected) {
      updateFormData({
        set_id: selected.id,
        noOfQuestionInCurrentSet: selected.questions.length,
      });
    }
  };

  const handleFlipSetSelection = (setId: string) => {
    const selected = sets.find((set: any) => set.id == setId);
    updateFormData({
      flipSet: parseInt(setId),
      noOfQuestionInFlipSet: selected?.questions?.length || 0,
    });
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
          error={errors.QuestionCount}
          required
        />
      </div>

      <div className="mb-6">
        <FormSelect
          label="Choose Category"
          value={formData.QuestionCategoryId}
          options={[{ value: "", label: "" }].concat(
            categories.map((category: any) => ({
              value: category.id,
              label: `${category.name}`,
            })),
          )}
          onChange={(e) => handleCategorySelection(e.target.value)}
          error={errors.QuestionCategoryId}
          required
        />
      </div>

      <div className="mb-6">
        <FormSelect
          label="Choose Set"
          value={formData.set_id}
          options={[{ value: "", label: "Select Question Set" }].concat(
            sets.map((set: any) => ({
              value: set.id,
              label: `${set.name} (${set?.questions?.length} - Questions)`,
            })),
          )}
          onChange={(e) => handleSetSelection(e.target.value)}
          error={errors.set_id}
          required
        />
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
          {formData.questions && (
            <FormInput
              label="Timer for all Questions (in seconds)"
              type="number"
              value={formData?.questions[0]?.timer}
              onChange={(e) => {
                const newTimer = e.target.value; // ensure a number!
                const questions = (formData.questions || []).map((q) => ({
                  ...q,
                  timer: newTimer,
                }));
                updateFormData({ questions });
              }}
              required
              // You may show a general error if you like, e.g. errors.questions?.[0]?.timer
            />
          )}
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
              value={formData.flip_fee}
              defaultValue={0}
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
                options={[{ value: "", label: "Choose Flip Set" }].concat(
                  sets.map((set: any) => ({
                    value: set.id,
                    label: `${set.name} (${set?.questions?.length} - Questions)`,
                  })),
                )}
                onChange={(e) => handleFlipSetSelection(e.target.value)}
                error={errors.flipSet}
                required
              />
            </div>
          </div>
        )}
      </span>
    </FormSection>
  );
};

export { OnlyQuestionForm };
