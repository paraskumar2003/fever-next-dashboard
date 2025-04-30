import React, { SelectHTMLAttributes } from "react";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  options,
  error,
  ...props
}) => {
  return (
    <div className="mb-4">
      <label className="mb-1  block text-sm font-medium">{label}</label>
      <select
        className={`w-full border bg-white/5 ${
          error ? "border-red-500" : "border-black/20"
        } rounded-md px-3 py-2  focus:outline-none focus:ring-2 focus:ring-purple-500`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FormSelect;
