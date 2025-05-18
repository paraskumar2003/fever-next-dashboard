import React from "react";
import { Plus } from "lucide-react";
import FormSection from "../FormSection";
import CategoryList from "../List/CategoryList";
import Button from "../Button";
import CategoryModal from "../Modal/CategoryModal";
import { useModal } from "@/hooks/useModal";
import { CategoryFormData } from "@/types/category";

interface CategorySectionProps {
  categories: any[];
  onView: (category: any) => void;
  onEdit: (category: any) => void;
  onDelete: (id: number) => void;
  onSave: (formData: CategoryFormData) => Promise<void>;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  onView,
  onEdit,
  onDelete,
  onSave,
}) => {
  const addCategoryModal = useModal();

  return (
    <FormSection
      title="Categories"
      headerAction={
        <Button variant="secondary" size="sm" onClick={addCategoryModal.open}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      }
    >
      <CategoryList
        categories={categories}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <CategoryModal
        isOpen={addCategoryModal.isOpen}
        onClose={addCategoryModal.close}
        onSave={onSave}
      />
    </FormSection>
  );
};

export default CategorySection;
