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
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome to Plenti Pricing 💜
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

          {/* Horizontal scrollable container */}
          <div className="overflow-x-auto pt-4 pb-4 -mx-2 px-2">
            <div className="flex gap-6 min-w-max">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryToggle(category.id)}
                  className={`flex-shrink-0 w-40 h-50 p-3 rounded-3xl border-2 transition-all duration-100 transform hover:scale-[1.02] flex flex-col items-center justify-center relative ${
                    selectedCategories.includes(category.id)
                      ? 'border-[#5F22D9] bg-[#5F22D9]/5 '
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
                      selectedCategories.includes(category.id)
                        ? 'bg-[#5F22D9] text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {category.icon}
                    </div>
                    
                    <div className="text-center space-y-2 flex-1 flex flex-col justify-center">
                      <h3 className="font-semibold text-base text-gray-900 leading-tight">{category.name}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed px-2">{category.description}</p>
                    </div>
                  </div>
                  
                  {selectedCategories.includes(category.id) && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-[#5F22D9] rounded-full flex items-center justify-center shadow-lg">
                      <CheckIcon className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
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