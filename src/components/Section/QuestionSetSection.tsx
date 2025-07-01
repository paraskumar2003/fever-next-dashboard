import React from "react";
import { Plus } from "lucide-react";
import FormSection from "../FormSection";
import QuestionSetList from "../List/QuestionSetList";
import Button from "../Button";
import QuestionSetModal from "../Modal/QuestionSetModal";
import { useModal } from "@/hooks/useModal";
import { QuestionSetFormData, QuestionSet } from "@/types/questionSet";

interface QuestionSetSectionProps {
  questionSets: QuestionSet[];
  onView: (questionSet: QuestionSet) => void;
  onEdit: (questionSet: QuestionSet) => void;
  onDelete: (id: number) => void;
  onSave: (formData: QuestionSetFormData) => Promise<void>;
  rowCount: number;
  onPaginationModelChange: (page: number, pageSize: number) => void;
}

const QuestionSetSection: React.FC<QuestionSetSectionProps> = ({
  questionSets,
  onView,
  onEdit,
  onDelete,
  onSave,
  rowCount,
  onPaginationModelChange,
}) => {
  const addQuestionSetModal = useModal();

  return (
    <FormSection
      title="Question Sets"
      headerAction={
        <Button variant="secondary" size="sm" onClick={addQuestionSetModal.open}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      }
    >
      <QuestionSetList
        questionSets={questionSets}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        rowCount={rowCount}
        onPaginationModelChange={onPaginationModelChange}
      />

      <QuestionSetModal
        isOpen={addQuestionSetModal.isOpen}
        onClose={addQuestionSetModal.close}
        onSave={onSave}
      />
    </FormSection>
  );
};

export default QuestionSetSection;