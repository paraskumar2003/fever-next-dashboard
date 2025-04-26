import React from "react";
import { Plus } from "lucide-react";
import FormSection from "../FormSection";
import InstructionList from "../List/InstructionList";
import Button from "../Button";
import { useModal } from "@/hooks/useModal";
import InstructionModal from "../Modal/InstructionModal";

interface InstructionSectionProps {
  instructions: any[];
  onView: (instruction: any) => void;
  onEdit: (instruction: any) => void;
  onDelete: (id: string) => void;
  onSave: () => Promise<void>;
}

const InstructionSection: React.FC<InstructionSectionProps> = ({
  instructions,
  onView,
  onEdit,
  onDelete,
  onSave,
}) => {
  const addInstructionModal = useModal();

  return (
    <FormSection
      title="Contest Instructions"
      headerAction={
        <Button
          variant="secondary"
          size="sm"
          onClick={addInstructionModal.open}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      }
    >
      <InstructionList
        instructions={instructions}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <InstructionModal
        isOpen={addInstructionModal.isOpen}
        onClose={addInstructionModal.close}
        onSave={onSave}
      />
    </FormSection>
  );
};

export default InstructionSection;
