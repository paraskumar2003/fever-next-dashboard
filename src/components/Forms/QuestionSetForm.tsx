import React, { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
import Button from "../Button";
import FormInput from "../FormInput";
import FormTextarea from "../FormTextarea";
import FormSelect from "../FormSelect";
import { QuestionSetServices } from "@/services/trivia/sets.service";
import { CategoryServices } from "@/services/category/category.service";
import { QuestionSetFormData, Category } from "@/types/questionSet";

interface QuestionSetData {
  id?: number;
  name: string;
  description: string;
  category: Category;
}

interface QuestionSetFormProps {
  readOnly?: boolean;
  questionSetData?: QuestionSetData;
  onSave?: (formData: QuestionSetFormData) => Promise<void>;
  onCancel?: () => void;
}

const QuestionSetForm: React.FC<QuestionSetFormProps> = ({
  readOnly = false,
  questionSetData,
  onSave,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formState, setFormState] = useState<QuestionSetFormData>({
    name: "",
    description: "",
    categoryId: 0,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await CategoryServices.getAllCategories({});
        if (data?.data?.rows) {
          setCategories(data.data.rows);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (questionSetData) {
      setFormState({
        name: questionSetData.name,
        description: questionSetData.description,
        categoryId: questionSetData.category.id,
      });
    }
  }, [questionSetData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: name === "categoryId" ? parseInt(value) : value,
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formState.name.trim()) {
      setError("Question set name is required");
      return false;
    }
    if (!formState.description.trim()) {
      setError("Question set description is required");
      return false;
    }
    if (!formState.categoryId || formState.categoryId === 0) {
      setError("Category is required");
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
      const payload = {
        categoryId: formState.categoryId,
        name: formState.name,
        description: formState.description,
      };

      if (questionSetData?.id) {
        await QuestionSetServices.updateQuestionSet(
          questionSetData.id,
          payload,
        );
      } else {
        await QuestionSetServices.createQuestionSet(payload);
      }

      setSuccess(true);
      if (onSave) await onSave(formState);
    } catch (err: any) {
      setError(
        err.message || "An error occurred while saving the question set",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
          Question set {questionSetData?.id ? "updated" : "created"}{" "}
          successfully!
        </div>
      )}

      <FormInput
        label="Question Set Name"
        name="name"
        value={formState.name}
        onChange={handleInputChange}
        placeholder="Enter question set name"
        disabled={readOnly}
        required
      />

      <FormTextarea
        label="Description"
        name="description"
        value={formState.description}
        onChange={handleInputChange}
        placeholder="Enter question set description"
        disabled={readOnly}
        required
        rows={4}
      />

      <FormSelect
        label="Category"
        name="categoryId"
        value={formState.categoryId.toString()}
        onChange={handleInputChange}
        options={[
          { value: "0", label: "Select a category" },
          ...categories.map((category) => ({
            value: category.id.toString(),
            label: category.name,
          })),
        ]}
        disabled={readOnly}
        required
      />

      {!readOnly && (
        <div className="flex space-x-3">
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center"
          >
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Saving..." : questionSetData?.id ? "Update" : "Save"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            className="flex items-center"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      )}
    </form>
  );
};

export default QuestionSetForm;
