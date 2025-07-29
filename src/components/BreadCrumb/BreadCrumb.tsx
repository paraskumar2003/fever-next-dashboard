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
    <nav className="mb-8 flex items-center space-x-1 text-sm">
      {steps.map((step, index) => (
        <div
          key={index}
          className="flex items-center"
          onClick={() => onClick?.(index)}
        >
          <div
            className={`flex items-center rounded-lg px-4 py-2 cursor-pointer transition-all duration-200 ${
              index === currentStep
                ? "bg-primary-600 text-white font-semibold shadow-md"
                : index < currentStep
                ? "bg-accent-100 text-accent-700 font-medium hover:bg-accent-200"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
              {index + 1}
            </span>
            {step}
          </div>
          {index < steps.length - 1 && (
            <svg
              className="mx-2 h-5 w-5 text-gray-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      ))}
    </nav>
  );
};

export { Breadcrumb };
