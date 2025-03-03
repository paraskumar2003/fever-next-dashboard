import React, { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      <label className="push mb-1 block text-sm font-medium">{label}</label>
      <input
        className={`w-full border bg-white/5 ${
          error ? "border-red-500" : "border-black/20"
        } rounded-md px-3 py-2 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FormInput;
