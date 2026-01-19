import React from 'react';
import InfoIcon from '../../common/InfoIcon';
import DietIcon from '../../common/DietIcon';

const ServingsSection = ({ 
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
        <div className="bg-white rounded-xl border border-green-500 border-2 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-2 mb-2">
            <DietIcon diet="veg" size="sm" />
            <label className="block text-sm font-medium text-gray-700">
              {vegLabel}
            </label>
          </div>
          <input
            type="number"
            value={vegServings || ''}
            onChange={(e) => setVegServings(e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200"
            placeholder={vegPlaceholder}
          />
        </div>

        <div className="bg-white rounded-xl border border-red-500 border-2 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-2 mb-2">
            <DietIcon diet="non_veg" size="sm" />
            <label className="block text-sm font-medium text-gray-700">
              {nonVegLabel}
            </label>
          </div>
          <input
            type="number"
            value={nonVegServings || ''}
            onChange={(e) => setNonVegServings(e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200"
            placeholder={nonVegPlaceholder}
          />
        </div>
      </div>
    </div>
  );
};

export default ServingsSection;