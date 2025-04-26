import React from "react";
import { Modal } from "@mui/material";
import Button from "../Button";
import OnlyQuestionForm from "../Forms/OnlyQuestion";

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionData?: any;
  isViewMode?: boolean;
  onSave?: () => Promise<void>;
}

const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  onClose,
  questionData,
  isViewMode = false,
  onSave,
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="question-modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2
            className="text-xl font-semibold text-gray-800"
            id="question-modal-title"
          >
            {isViewMode
              ? "View Question"
              : questionData
                ? "Edit Question"
                : "Add Question"}
          </h2>
        </div>

        <div className="p-6">
          <OnlyQuestionForm
            readOnly={isViewMode}
            questionData={questionData}
            onSave={async (formData: any) => {
              if (onSave) {
                await onSave();
              }
              onClose();
            }}
          />
        </div>

        <div className="flex justify-end border-t border-gray-200 px-6 py-4">
          <Button variant="secondary" onClick={onClose}>
            {isViewMode ? "Close" : "Cancel"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default QuestionModal;
