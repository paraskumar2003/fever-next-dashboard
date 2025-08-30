import React, { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
import Button from "../Button";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import FormTextarea from "../FormTextarea";
import { CategoryServices, TriviaServices } from "@/services";
import { QuestionSetServices } from "@/services/trivia/sets.service";
import { Category } from "@/types/category";

interface QuestionData {
  id?: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: string;
  timer: number;
  status: number;
  categoryId: number | null;
  set_id?: number | null;
}

interface QuestionSet {
  id: number;
  name: string;
  description: string;
}

interface OnlyQuestionFormProps {
  readOnly?: boolean;
  questionData?: QuestionData;
  onSave?: (formData: QuestionData) => Promise<void>;
  onCancel?: () => void;
}

const OnlyQuestionForm: React.FC<OnlyQuestionFormProps> = ({
  readOnly = false,
  questionData,
  onSave,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formState, setFormState] = useState<QuestionData>({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctOption: "option1",
    timer: 10000,
    status: 1,
    categoryId: null,
    set_id: null,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [questionSetsForCategory, setQuestionSetsForCategory] = useState<
    QuestionSet[]
  >([]);
  const [selectedQuestionSetId, setSelectedQuestionSetId] = useState<
    number | null
  >(null);

  useEffect(() => {
    console.log({ questionData, formState });
  }, [questionData, formState]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await CategoryServices.getAllCategories({});
        if (data?.data) {
          setCategories(data.data.rows);
          // Handle initial data loading
          if (questionData) {
            // Edit mode - fetch question sets for the existing category
            if (questionData.categoryId) {
              setFormState((prev) => ({
                ...prev,
                categoryId: questionData.categoryId,
              }));
              await fetchQuestionSetsByCategory(questionData.categoryId);
              setSelectedQuestionSetId(questionData.set_id || null);
            } else {
              setFormState((prev) => ({
                ...prev,
                categoryId: data.data.rows[0].id,
              }));
            }
          } else if (data.data.rows.length > 0) {
            // Add mode - fetch question sets for the first category
            const firstCategoryId = data.data.rows[0].id;
            setFormState((prev) => ({ ...prev, category_id: firstCategoryId }));
            await fetchQuestionSetsByCategory(firstCategoryId);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (questionData) {
      setFormState(questionData);
      setSelectedQuestionSetId(questionData.set_id || null);
    }
  }, [questionData]);

  const fetchQuestionSetsByCategory = async (categoryId: number) => {
    try {
      const { data } =
        await QuestionSetServices.getQuestionSetsByCategoryId(categoryId);
      if (data?.data?.rows) {
        setQuestionSetsForCategory(data.data.rows);
        // If no question set is selected and there are available sets, select the first one
        if (!selectedQuestionSetId && data.data.rows.length > 0) {
          setSelectedQuestionSetId(data.data.rows[0].id);
        }
      } else {
        setQuestionSetsForCategory([]);
        setSelectedQuestionSetId(null);
      }
    } catch (error) {
      console.error("Error fetching question sets:", error);
      setQuestionSetsForCategory([]);
      setSelectedQuestionSetId(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    if (readOnly) return;

    const { name, value } = e.target;

    if (name === "categoryId") {
      const categoryId = parseInt(value);
      setFormState((prev) => ({
        ...prev,
        [name]: categoryId,
      }));

      // Fetch question sets for the new category
      if (categoryId) {
        fetchQuestionSetsByCategory(categoryId);
        setSelectedQuestionSetId(null); // Reset question set selection
      }
    } else {
      setFormState((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleQuestionSetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const setId = parseInt(e.target.value);
    setSelectedQuestionSetId(setId || null);
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formState.question?.trim()) {
      errors.push("Question text is required");
    }

    const { option1, option2, option3, option4 } = formState;

    if (
      !option1?.trim() ||
      !option2?.trim() ||
      !option3?.trim() ||
      !option4?.trim()
    ) {
      errors.push("All answer options are required");
    } else {
      // Check for duplicate options
      const options = [
        option1.trim(),
        option2.trim(),
        option3.trim(),
        option4.trim(),
      ];
      const uniqueOptions = new Set(options);

      if (uniqueOptions.size < options.length) {
        errors.push("Answer options must be unique");
      }
    }

    if (!formState.categoryId) {
      errors.push("Category is required");
    }

    if (!selectedQuestionSetId) {
      errors.push("Question set is required");
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
        question: formState.question,
        status: formState.status,
        answers: [
          {
            answer: formState.option1,
            isCorrect: formState.correctOption === "option1",
          },
          {
            answer: formState.option2,
            isCorrect: formState.correctOption === "option2",
          },
          {
            answer: formState.option3,
            isCorrect: formState.correctOption === "option3",
          },
          {
            answer: formState.option4,
            isCorrect: formState.correctOption === "option4",
          },
        ],
        category_id: formState.categoryId
          ? parseInt(formState.categoryId.toString())
          : null,
        timer: formState.timer.toString(),
        set_id: selectedQuestionSetId, // Add set_id to the payload
      };

      // If it's a new question, create it
      if (!questionData) {
        await TriviaServices.createQuestion(payload);
      } else {
        if (questionData.id)
          await TriviaServices.updateQuestion(payload, questionData.id);
      }

      if (onSave) {
        await onSave({ ...formState, set_id: selectedQuestionSetId });
      }

      setSuccess(true);

      if (!questionData) {
        // Reset form only for new questions
        setFormState({
          question: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          correctOption: "option1",
          timer: 10000,
          status: 1,
          categoryId: categories.length > 0 ? +categories[0].id : null,
          set_id: null,
        });
        setSelectedQuestionSetId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error submitting question:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
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
          Question saved successfully!
        </div>
      )}

      <div className="space-y-4">
        <FormSelect
          label="Category"
          name="categoryId"
          value={formState.categoryId || ""}
          onChange={handleInputChange}
          options={[{ value: "", label: "Select a category" }].concat(
            categories.map((category) => ({
              value: category.id.toString(),
              label: `${category.name} - ${category.questions.length} Questions`,
            })),
          )}
          disabled={readOnly}
          required
        />

        <FormSelect
          label="Question Set"
          name="set_id"
          value={selectedQuestionSetId?.toString() || ""}
          onChange={handleQuestionSetChange}
          options={[{ value: "", label: "Select a question set" }].concat(
            questionSetsForCategory.map((questionSet) => ({
              value: questionSet.id.toString(),
              label: questionSet.name,
            })),
          )}
          disabled={readOnly || questionSetsForCategory.length === 0}
          required
        />

        <FormTextarea
          label="Question"
          name="question"
          value={formState.question}
          onChange={handleInputChange}
          placeholder="Enter your question"
          rows={3}
          required
          disabled={readOnly}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            label="Option 1"
            name="option1"
            value={formState.option1}
            onChange={handleInputChange}
            placeholder="Enter option 1"
            required
            disabled={readOnly}
          />
          <FormInput
            label="Option 2"
            name="option2"
            value={formState.option2}
            onChange={handleInputChange}
            placeholder="Enter option 2"
            required
            disabled={readOnly}
          />
          <FormInput
            label="Option 3"
            name="option3"
            value={formState.option3}
            onChange={handleInputChange}
            placeholder="Enter option 3"
            required
            disabled={readOnly}
          />
          <FormInput
            label="Option 4"
            name="option4"
            value={formState.option4}
            onChange={handleInputChange}
            placeholder="Enter option 4"
            required
            disabled={readOnly}
          />
        </div>

        <FormSelect
          label="Correct Answer"
          name="correctOption"
          value={formState.correctOption}
          onChange={handleInputChange}
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
            { value: "option4", label: "Option 4" },
          ]}
          disabled={readOnly}
          required
        />
        {/* 
        <FormInput
          label="Timer (milliseconds)"
          name="timer"
          type="number"
          value={formState.timer}
          onChange={handleInputChange}
          min="1000"
          step="1000"
          required
          disabled={readOnly}
        /> */}
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          className="bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        {!readOnly && (
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading
              ? "Saving..."
              : questionData
                ? "Update Question"
                : "Save Question"}
          </Button>
        )}
      </div>
    </form>
  );
};

export default OnlyQuestionForm;
