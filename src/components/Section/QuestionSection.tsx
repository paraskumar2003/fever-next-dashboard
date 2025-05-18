import React, { useState } from "react";
import { Plus } from "lucide-react";
import FormSection from "../FormSection";
import QuestionList from "../List/QuestionList";
import Button from "../Button";
import QuestionModal from "../Modal/QuestionModal";
import { useModal } from "@/hooks/useModal";

interface QuestionSectionProps {
  questions: any[];
  rowCount: number;
  onPagninationModelChange: (page: number) => void;
  onView: (question: any) => void;
  onEdit: (question: any) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: number) => void;
  onSave: () => Promise<void>;
}

const QuestionSection: React.FC<QuestionSectionProps> = ({
  questions,
  rowCount,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onSave,
  onPagninationModelChange,
}) => {
  const addQuestionModal = useModal();

  return (
    <FormSection
      title="Contest Questions"
      headerAction={
        <Button variant="secondary" size="sm" onClick={addQuestionModal.open}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      }
    >
      <QuestionList
        rowCount={rowCount}
        onPaginationModelChange={onPagninationModelChange}
        questions={questions}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />

      <QuestionModal
        isOpen={addQuestionModal.isOpen}
        onClose={addQuestionModal.close}
        onSave={onSave}
      />
    </FormSection>
  );
};

export default QuestionSection;
