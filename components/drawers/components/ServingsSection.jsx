import React from 'react';
import InfoIcon from '../../common/InfoIcon';

const ServingsSection = ({ 
  isVeg, 
  isNonVeg, 
  vegServings, 
  setVegServings, 
  nonVegServings, 
  setNonVegServings,
  isEdit = false 
}) => {
  const servingsLabel = isEdit ? "Current Servings" : "Servings Available";
  const vegLabel = isEdit ? "Vegetarian Servings (Current)" : "Vegetarian Servings";
  const nonVegLabel = isEdit ? "Non-Vegetarian Servings (Current)" : "Non-Vegetarian Servings";
  const vegPlaceholder = isEdit ? "Enter current vegetarian servings" : "Enter number of vegetarian servings";
  const nonVegPlaceholder = isEdit ? "Enter current non-vegetarian servings" : "Enter number of non-vegetarian servings";

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{servingsLabel}</h3>
        <InfoIcon content={isEdit ? "Set the current number of servings available for each diet type" : "Set the number of servings available for each diet type"} />
      </div>
      <div className="space-y-4">
        {isVeg && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {vegLabel}
            </label>
            <input
              type="number"
              min="0"
              value={vegServings}
              onChange={(e) => setVegServings(parseInt(e.target.value) || 0)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200"
              placeholder={vegPlaceholder}
            />
          </div>
        )}

        {isNonVeg && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {nonVegLabel}
            </label>
            <input
              type="number"
              min="0"
              value={nonVegServings}
              onChange={(e) => setNonVegServings(parseInt(e.target.value) || 0)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200"
              placeholder={nonVegPlaceholder}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ServingsSection;


