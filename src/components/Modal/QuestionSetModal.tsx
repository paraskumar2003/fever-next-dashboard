import React from "react";
import { Modal } from "@mui/material";
import QuestionSetForm from "../Forms/QuestionSetForm";
import { QuestionSetFormData } from "@/types/questionSet";

interface QuestionSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionSetData?: any;
  isViewMode?: boolean;
  onSave?: (formData: QuestionSetFormData) => Promise<void>;
}

const QuestionSetModal: React.FC<QuestionSetModalProps> = ({
  isOpen,
  onClose,
  questionSetData,
  isViewMode = false,
  onSave,
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="question-set-modal-title"
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
            id="question-set-modal-title"
          >
            {isViewMode
              ? "View Question Set"
              : questionSetData
                ? "Edit Question Set"
                : "Add Question Set"}
          </h2>
        </div>

        <div className="p-6">
          <QuestionSetForm
            readOnly={isViewMode}
            questionSetData={questionSetData}
            onSave={async (formData: QuestionSetFormData) => {
              if (onSave) {
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

export default QuestionSetModal;