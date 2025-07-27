// vendor-web-app/components/sections/bussiness/profile/CategorySelection.jsx
import React from 'react';
import { CheckIcon, ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';

const CategorySelection = ({ categories, selectedCategories, onCategoryToggle, onNext }) => {
  return (
    <div className="min-h-screen from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-16 space-y-4">
          <div className="w-16 h-16 bg-[#5F22D9]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <SparklesIcon className="w-8 h-8 text-[#5F22D9]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome to Plenti! 🎉
          </h1>
          <p className="text-base text-gray-600 max-w-md mx-auto">
            Let's set up your pricing strategy to maximize your earnings
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">
              What would you like to sell?
            </h2>
            <p className="text-sm text-gray-600">
              Select all categories that apply to your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryToggle(category.id)}
                className={`aspect-square p-6 rounded-3xl border-2 transition-all duration-300 transform hover:scale-[1.02] flex flex-col items-center justify-center space-y-3 relative ${
                  selectedCategories.includes(category.id)
                    ? 'border-[#5F22D9] bg-[#5F22D9]/5 '
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
                  selectedCategories.includes(category.id)
                    ? 'bg-[#5F22D9] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {category.icon}
                </div>
                
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-base text-gray-900">{category.name}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{category.description}</p>
                </div>
                
                {selectedCategories.includes(category.id) && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-[#5F22D9] rounded-full flex items-center justify-center shadow-lg">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="pt-6">
            <button
              onClick={onNext}
              disabled={selectedCategories.length === 0}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                selectedCategories.length > 0
                  ? 'bg-[#5F22D9] text-white hover:bg-[#4A1BB8] shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span className="text-sm">Continue</span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySelection;