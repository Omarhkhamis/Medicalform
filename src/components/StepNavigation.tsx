import React from 'react';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isValid: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSubmit,
  isValid
}) => {
  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
      <button
        type="button"
        onClick={onPrevious}
        disabled={currentStep === 1}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
          currentStep === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
        }`}
      >
        <ChevronLeft size={20} />
        Previous
      </button>

      <div className="flex gap-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i + 1 <= currentStep
                ? 'bg-blue-500 shadow-lg shadow-blue-200'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {currentStep === totalSteps ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={!isValid}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            isValid
              ? 'bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:shadow-green-200'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Send size={20} />
          Generate PDF
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            isValid
              ? 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
};

export default StepNavigation;