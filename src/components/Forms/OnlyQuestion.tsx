import React, { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import Button from "../Button";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import FormTextarea from "../FormTextarea";
import FormSection from "../FormSection";
import { useContest } from "@/context/ContestContext";
import { Question } from "@/types";
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

const OnlyQuestionForm = () => {
  const { formData, updateFormData } = useContest();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const questions = formData.questions || [];

  const handleInputChange = (
    index: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [name]: value,
    };
    updateFormData({ questions: updatedQuestions });
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correctOption: "option1",
      timer: "10000",
    };
    updateFormData({ questions: [...questions, newQuestion] });
  };

  const removeQuestion = async (index: number) => {
    if (questions.length > 1) {
      const questionToRemove = questions[index];

      try {
        if (questionToRemove.id) {
          await TriviaServices.deleteQuestion(questionToRemove.id);
        }

        const updatedQuestions = questions.filter((_, i) => i !== index);
        updateFormData({ questions: updatedQuestions });

        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        setError("Failed to delete question. Please try again.");
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const validateForm = () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question?.trim()) {
        setError(`Question ${i + 1}: Question text is required`);
        return false;
      }

      if (
        !q.option1?.trim() ||
        !q.option2?.trim() ||
        !q.option3?.trim() ||
        !q.option4?.trim()
      ) {
        setError(`Question ${i + 1}: All answer options are required`);
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
      // Your question submission logic here
      setSuccess(true);

      // Reset form after successful submission
      updateFormData({
        questions: [
          {
            question: "",
            option1: "",
            option2: "",
            option3: "",
            option4: "",
            correctOption: "option1",
            timer: "10000",
          },
        ],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error submitting questions:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormSection title="Questions">
      {error && (
        <div className="mb-4 rounded-md border border-red-500 bg-red-500/20 p-4 text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-md border border-green-500 bg-green-500/20 p-4 text-green-200">
          Questions saved successfully!
        </div>
      )}

      {questions.map((questionData, index) => (
        <div
          key={index}
          className="mb-4 rounded-md border border-white/10 bg-white/5 p-4"
        >
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-medium ">Question #{index + 1}</h3>
            {questions.length > 1 && (
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => removeQuestion(index)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Question
              </Button>
            )}
          </div>

          <FormTextarea
            label="Question"
            name="question"
            value={questionData.question || ""}
            onChange={(e) => handleInputChange(index, e)}
            placeholder="Enter your question"
            rows={3}
            required
          />

          <div className="space-y-4">
            <h3 className="font-medium ">Answer Options</h3>
            {["option1", "option2", "option3", "option4"].map(
              (option, optionIndex) => (
                <FormInput
                  key={option}
                  label={`Option ${optionIndex + 1}`}
                  name={option}
                  value={
                    (questionData[
                      option as keyof typeof questionData
                    ] as string) || ""
                  }
                  onChange={(e) => handleInputChange(index, e)}
                  placeholder={`Enter option ${optionIndex + 1}`}
                  required
                />
              ),
            )}

            <FormSelect
              label="Correct Answer"
              name="correctOption"
              value={questionData.correctOption || "option1"}
              onChange={(e) => handleInputChange(index, e)}
              options={[
                { value: "option1", label: "Option 1" },
                { value: "option2", label: "Option 2" },
                { value: "option3", label: "Option 3" },
                { value: "option4", label: "Option 4" },
              ]}
            />

            <FormInput
              label="Timer (milliseconds)"
              name="timer"
              type="number"
              value={questionData.timer || 10000}
              onChange={(e) => handleInputChange(index, e)}
              min="1000"
              step="1000"
              required
            />
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between">
        <Button type="button" variant="secondary" onClick={addQuestion}>
          <Plus className="mr-2 h-4 w-4" />
          Add Another Question
        </Button>

        <Button type="submit" disabled={loading} onClick={handleSubmit}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Saving..." : "Save Questions"}
        </Button>
      </div>
    </FormSection>
  );
};

export default OnlyQuestionForm;
