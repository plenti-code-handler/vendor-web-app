// vendor-web-app/components/sections/bussiness/profile/CategorySelection.jsx
import React from 'react';
import { CheckIcon, ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';

const CategorySelection = ({ categories, selectedCategories, onCategoryToggle, onNext }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12 space-y-4">
          <div className="w-20 h-20 bg-[#5F22D9]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <SparklesIcon className="w-10 h-10 text-[#5F22D9]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Plenti! 🎉
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Let's set up your pricing strategy to maximize your earnings
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">
              What would you like to sell?
            </h2>
            <p className="text-gray-600">
              Select all categories that apply to your business
            </p>
          </div>

          <div className="grid gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryToggle(category.id)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                  selectedCategories.includes(category.id)
                    ? 'border-[#5F22D9] bg-[#5F22D9]/5 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                    selectedCategories.includes(category.id)
                      ? 'bg-[#5F22D9] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {category.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                  {selectedCategories.includes(category.id) && (
                    <CheckIcon className="w-6 h-6 text-[#5F22D9]" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={onNext}
            disabled={selectedCategories.length === 0}
            className={`w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
              selectedCategories.length > 0
                ? 'bg-[#5F22D9] text-white hover:bg-[#4A1BB8] shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>Continue</span>
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategorySelection;