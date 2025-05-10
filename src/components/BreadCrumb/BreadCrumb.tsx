import React from "react";

interface BreadcrumbProps {
  currentStep: number;
  steps: string[];
  onClick?: (e: number) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  currentStep,
  steps,
  onClick,
}) => {
  return (
    <nav className="mb-4 flex cursor-pointer space-x-2 text-sm text-gray-600">
      {steps.map((step, index) => (
        <span
          key={index}
          className={index === currentStep ? "font-semibold text-blue-600" : ""}
          onClick={() => onClick?.(index)}
        >
          {step}
          {index < steps.length - 1 && <span className="mx-2">{" > "}</span>}
        </span>
      ))}
    </nav>
  );
};

export { Breadcrumb };
