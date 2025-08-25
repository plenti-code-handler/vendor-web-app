import React from 'react';
import InfoIcon from '../../common/InfoIcon';
import { ALLERGENS_OPTIONS } from '../../../utility/bagDrawerUtils';

const AllergensSection = ({ selectedAllergens, setSelectedAllergens }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Allergens</h3>
        <InfoIcon content="Select allergens present in your item to help customers with dietary restrictions" />
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="grid grid-cols-2 gap-3">
          {ALLERGENS_OPTIONS.map((allergen) => (
            <label key={allergen} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedAllergens.includes(allergen)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedAllergens([...selectedAllergens, allergen]);
                  } else {
                    setSelectedAllergens(selectedAllergens.filter(item => item !== allergen));
                  }
                }}
                className="w-4 h-4 text-[#5F22D9] bg-gray-100 border-gray-300 rounded focus:ring-[#5F22D9] focus:ring-2"
              />
              <span className="text-sm font-medium text-gray-700">{allergen}</span>
            </label>
          ))}
        </div>
        {selectedAllergens.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 font-medium mb-2">Selected Allergens:</p>
            <div className="flex flex-wrap gap-2">
              {selectedAllergens.map((allergen) => (
                <span
                  key={allergen}
                  className="px-2 py-1 bg-[#5F22D9]/10 text-[#5F22D9] text-xs font-medium rounded-md"
                >
                  {allergen}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllergensSection;
