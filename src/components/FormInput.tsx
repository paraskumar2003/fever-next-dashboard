import React, { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, error, ...props }) => {
  return (
    <div className="mb-6">
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        <span>{label}</span>
        {props.required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        className={`w-full border bg-white/5 ${
          error 
            ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
            : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
        } rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50`}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormInput;
