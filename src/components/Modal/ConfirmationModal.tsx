import React from "react";
import { Modal } from "@mui/material";
import { AlertTriangle, X } from "lucide-react";
import Button from "../Button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          iconColor: "text-red-500",
          confirmButtonVariant: "danger" as const,
        };
      case "warning":
        return {
          iconColor: "text-orange-500",
          confirmButtonVariant: "secondary" as const,
        };
      case "info":
        return {
          iconColor: "text-blue-500",
          confirmButtonVariant: "primary" as const,
        };
      default:
        return {
          iconColor: "text-red-500",
          confirmButtonVariant: "danger" as const,
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="confirmation-modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className={`h-6 w-6 ${styles.iconColor}`} />
              <h2
                className="text-lg font-semibold text-gray-800"
                id="confirmation-modal-title"
              >
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-4">
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="flex justify-end space-x-3 border-t border-gray-200 px-6 py-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={styles.confirmButtonVariant}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;