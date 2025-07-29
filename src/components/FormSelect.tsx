import React, { SelectHTMLAttributes } from "react";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string; disabled?: boolean }[];
  error?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  options,
  error,
  ...props
}) => {
  return (
    <div className="mb-6">
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        <span>{label}</span>
        {props.required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <select
        className={`w-full border bg-white/5 ${
          error 
            ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
            : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
        } rounded-lg px-4 py-3 text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50`}
        {...props}
      >
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value} 
            disabled={option.disabled}
            className="text-gray-900"
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormSelect;
