import React, { useState } from "react";
import axios from "axios";
import Button from "../Button";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import FormTextarea from "../FormTextarea";
import FormSection from "../FormSection";
import { Save, Plus, Trash2 } from "lucide-react";

interface QuestionData {
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
  const [questions, setQuestions] = useState<QuestionData[]>([
    {
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correctOption: "option1",
      timer: 10000,
      status: 1,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correctOption: "option1",
        timer: 10000,
        status: 1,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    }
  };

  const validateForm = () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setError(`Question ${i + 1}: Question text is required`);
        return false;
      }

      if (
        !q.option1.trim() ||
        !q.option2.trim() ||
        !q.option3.trim() ||
        !q.option4.trim()
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
      const results = await Promise.all(
        questions.map(async (formData) => {
          const apiPayload = {
            question: formData.question,
            status: formData.status,
            timer: formData.timer,
            answers: [
              {
                answer: formData.option1,
                isCorrect: formData.correctOption === "option1",
              },
              {
                answer: formData.option2,
                isCorrect: formData.correctOption === "option2",
              },
              {
                answer: formData.option3,
                isCorrect: formData.correctOption === "option3",
              },
              {
                answer: formData.option4,
                isCorrect: formData.correctOption === "option4",
              },
            ],
          };

          return axios.post(
            "https://v3api.countrygame.live/v1/trivia/create-question",
            apiPayload,
            {
              headers: {
                Authorization:
                  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6bnVsbCwic3ViIjoiMzUiLCJpYXQiOjE3MjkzNTIwNjF9.A0smZ9tH6-57r5fqEK4vNc-e4tS2pwFuV6MZp5FixA0",
                "Content-Type": "application/json",
              },
            },
          );
        }),
      );

      setSuccess(true);
      console.log("Questions created:", results);

      // Reset form
      setQuestions([
        {
          question: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          correctOption: "option1",
          timer: 10000,
          status: 1,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error submitting questions:", err);
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
            Questions created successfully!
          </div>
        )}

        {questions.map((questionData, index) => (
          <FormSection key={index} title={`Question ${index + 1}`}>
            <div className="mb-4 flex justify-end">
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
              value={questionData.question}
              onChange={(e) => handleInputChange(index, e)}
              placeholder="Enter your question"
              rows={3}
              required
            />

            <div className="space-y-4">
              <h3 className="font-medium text-white">Answer Options</h3>
              {["option1", "option2", "option3", "option4"].map(
                (option, optionIndex) => (
                  <FormInput
                    key={option}
                    label={`Option ${optionIndex + 1}`}
                    name={option}
                    value={
                      questionData[
                        option as keyof typeof questionData
                      ] as string
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
                value={questionData.correctOption}
                onChange={(e) => handleInputChange(index, e)}
                options={[
                  { value: "option1", label: "Option 1" },
                  { value: "option2", label: "Option 2" },
                  { value: "option3", label: "Option 3" },
                  { value: "option4", label: "Option 4" },
                ]}
              />
            </div>

            <FormInput
              label="Timer (milliseconds)"
              name="timer"
              type="number"
              value={questionData.timer}
              onChange={(e) => handleInputChange(index, e)}
              min="1000"
              step="1000"
              required
            />
          </FormSection>
        ))}

        <div className="flex items-center justify-between">
          <Button type="button" variant="secondary" onClick={addQuestion}>
            <Plus className="mr-2 h-4 w-4" />
            Add Another Question
          </Button>

          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Creating..." : "Create Questions"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OnlyQuestionForm;
