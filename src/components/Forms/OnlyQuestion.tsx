import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import Button from "../Button";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import FormTextarea from "../FormTextarea";
import { TriviaServices } from "@/services";

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
}

interface OnlyQuestionFormProps {
  readOnly?: boolean;
  questionData?: QuestionData;
  onSave?: (formData: QuestionData) => Promise<void>;
}

const OnlyQuestionForm: React.FC<OnlyQuestionFormProps> = ({
  readOnly = false,
  questionData,
  onSave,
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
  });

  useEffect(() => {
    if (questionData) {
      setFormState(questionData);
    }
  }, [questionData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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

    if (!formState.question?.trim()) {
      errors.push("Question text is required");
    }

    if (
      !formState.option1?.trim() ||
      !formState.option2?.trim() ||
      !formState.option3?.trim() ||
      !formState.option4?.trim()
    ) {
      errors.push("All answer options are required");
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
        timer: formState.timer.toString(),
      };

      // If it's a new question, create it
      if (!questionData) {
        await TriviaServices.createQuestion(payload);
      } else {
        if (questionData.id)
          await TriviaServices.updateQuestion(payload, questionData.id);
      }

      if (onSave) {
        await onSave(formState);
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
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error submitting question:", err);
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
          Question saved successfully!
        </div>
      )}

      <div className="space-y-4">
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
        />

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
        />
      </div>

      {!readOnly && (
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading
              ? "Saving..."
              : questionData
                ? "Update Question"
                : "Save Question"}
          </Button>
        </div>
      )}
    </form>
  );
};

export default OnlyQuestionForm;
