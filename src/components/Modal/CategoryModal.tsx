import React from "react";
import { Modal } from "@mui/material";
import Button from "../Button";
import CategoryForm from "../Forms/CategoryForm";
import { CategoryFormData } from "@/types/category";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryData?: any;
  isViewMode?: boolean;
  onSave?: (formData: CategoryFormData) => Promise<void>;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  categoryData,
  isViewMode = false,
  onSave,
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="category-modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2
            className="text-xl font-semibold text-gray-800"
            id="category-modal-title"
          >
            {isViewMode
              ? "View Category"
              : categoryData
                ? "Edit Category"
                : "Add Category"}
          </h2>
        </div>

        <div className="p-6">
          <CategoryForm
            readOnly={isViewMode}
            categoryData={categoryData}
            onSave={async (formData: any) => {
              console.log({ formData });
              if (onSave && formData) {
                await onSave(formData);
              }
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CategoryModal;
