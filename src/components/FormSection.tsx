import React, { ReactNode } from "react";
import Button from "./Button";

interface FormSectionProps {
  title: string;
  children: ReactNode;
  onEdit?: Function;
  onSave?: Function;
  headerAction?: ReactNode;
  saveButtonText?: string;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
  onEdit,
  onSave,
  headerAction,
  saveButtonText = "Save",
}) => {
  return (
    <div className="mb-8 rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
      <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {title}
        </h2>
        <div className="flex items-center gap-3">
          {headerAction}
          {onEdit && (
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => onEdit()}
            >
              Edit
            </Button>
          )}
          {onSave && (
            <Button
              variant="primary"
              size="sm"
              type="submit"
              onClick={() => onSave()}
            >
              {saveButtonText}
            </Button>
          )}
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
};

export default FormSection;
