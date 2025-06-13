import React, { InputHTMLAttributes } from "react";

interface FormCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  label,
  error,
  ...props
}) => {
  return (
    <div className="mb-4">
      <label className="flex items-center space-x-2 text-sm font-medium">
        <input
          type="checkbox"
          className={`h-4 w-4 rounded border ${
            error ? "border-red-500" : "border-black/20"
          } text-purple-600 focus:ring-purple-500`}
          {...props}
        />
        <span>
          {label} {props.required && <span className="text-red-500">*</span>}
        </span>
      </label>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FormCheckbox;
