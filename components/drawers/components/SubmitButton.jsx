import React from 'react';
import { whiteLoader } from '../../../svgs';

const SubmitButton = ({ 
  loading, 
  disabled, 
  onClick, 
  loadingText, 
  buttonText, 
  availableCategories 
}) => {
  return (
    <div className="mt-8 mb-6">
      <button
        disabled={availableCategories.length === 0 || loading || disabled}
        onClick={onClick}
        className={`flex justify-center items-center bg-gradient-to-r from-[#5F22D9] to-[#7C3AED] text-white font-semibold py-4 rounded-xl hover:from-[#4A1BB8] hover:to-[#6B21A8] gap-3 w-full transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl ${
          availableCategories.length === 0 || loading || disabled ? "opacity-50 cursor-not-allowed" : "opacity-100 cursor-pointer"
        }`}
      >
        {loading && (
          <div className="animate-spin flex items-center justify-center">
            {whiteLoader}
          </div>
        )}
        {loading ? loadingText : buttonText}
      </button>
      
      {availableCategories.length === 0 && (
        <p className="text-center text-sm text-gray-500 mt-3">
          No item types available. Please contact support.
        </p>
      )}
    </div>
  );
};

export default SubmitButton;
