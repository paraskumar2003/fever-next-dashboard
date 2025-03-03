import React, { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <div className="mb-8 rounded-lg border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md">
      <h2 className="mb-4 border-b border-white/20  pb-2 text-xl font-bold">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
};

export default FormSection;
