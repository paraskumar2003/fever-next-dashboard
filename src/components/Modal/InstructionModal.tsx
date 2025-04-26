import React from "react";
import { Modal } from "@mui/material";
import Button from "../Button";
import OnlyInstructionForm from "../Forms/OnlyInstructionForm";

interface InstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructionData?: any;
  isViewMode?: boolean;
  onSave?: () => Promise<void>;
}

const InstructionModal: React.FC<InstructionModalProps> = ({
  isOpen,
  onClose,
  instructionData,
  isViewMode = false,
  onSave,
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="instruction-modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2
            className="text-xl font-semibold text-gray-800"
            id="instruction-modal-title"
          >
            {isViewMode
              ? "View Instruction"
              : instructionData
                ? "Edit Instruction"
                : "Add Instruction"}
          </h2>
        </div>

        <div className="p-6">
          <OnlyInstructionForm
            readOnly={isViewMode}
            instructionData={instructionData}
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

export default InstructionModal;
