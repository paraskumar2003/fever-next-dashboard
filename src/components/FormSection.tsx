import React, { ReactNode } from "react";
import Button from "./Button";

interface FormSectionProps {
  title: string;
  children: ReactNode;
  onEdit?: Function;
  onSave?: Function;
  headerAction?: ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
  onEdit,
  onSave,
  headerAction,
}) => {
  return (
    <div className="mb-8 rounded-lg border border-white/20 bg-white p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between">
        <h2 className="mb-4 border-b border-white/20 pb-2 text-xl font-bold ">
          {title}
        </h2>
        <div className="flex gap-2">
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
              variant="success"
              size="sm"
              type="submit"
              onClick={() => onSave()}
            >
              Save
            </Button>
          )}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
};

export default FormSection;
