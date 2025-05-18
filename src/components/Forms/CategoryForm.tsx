import React, { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
import Button from "../Button";
import FormInput from "../FormInput";
import FormTextarea from "../FormTextarea";
import { CategoryServices } from "@/services/category/category.service";

interface CategoryData {
  id?: number;
  name: string;
  description: string;
}

interface CategoryFormProps {
  readOnly?: boolean;
  categoryData?: CategoryData;
  onSave?: (formData: any) => Promise<void>;
  onCancel?: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  readOnly = false,
  categoryData,
  onSave,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formState, setFormState] = useState<CategoryData>({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (categoryData) {
      setFormState(categoryData);
    }
  }, [categoryData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formState.name.trim()) {
      setError("Category name is required");
      return false;
    }
    if (!formState.description.trim()) {
      setError("Category description is required");
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
      // Create the payload
      const payload = {
        name: formState.name,
        description: formState.description,
      };

      // Call the API to create or update the category
      if (formState.id) {
        await CategoryServices.updateCategory(formState.id.toString(), payload);
      } else {
        await CategoryServices.createCategory(payload);
      }

      setSuccess(true);
      if (onSave) await onSave(formState);
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the category");
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
          Category {formState.id ? "updated" : "created"} successfully!
        </div>
      )}

      <FormInput
        label="Category Name"
        name="name"
        value={formState.name}
        onChange={handleInputChange}
        placeholder="Enter category name"
        disabled={readOnly}
        required
      />

      <FormTextarea
        label="Description"
        name="description"
        value={formState.description}
        onChange={handleInputChange}
        placeholder="Enter category description"
        disabled={readOnly}
        required
        rows={4}
      />

      {!readOnly && (
        <div className="flex space-x-3">
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center"
          >
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Saving..." : formState.id ? "Update" : "Save"}
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

export default CategoryForm;
