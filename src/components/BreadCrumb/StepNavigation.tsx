import React from "react";

interface StepNavigationProps {
  onNext: () => void;
  onPrev: () => void;
  currentStep: number;
  totalSteps: number;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  onNext,
  onPrev,
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="mt-6 flex justify-between">
      <button
        onClick={onPrev}
        disabled={currentStep === 0}
        className="rounded bg-gray-300 px-4 py-2 disabled:opacity-50"
      >
        Previous
      </button>
      <button
        onClick={onNext}
        disabled={currentStep === totalSteps - 1}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export { StepNavigation };
