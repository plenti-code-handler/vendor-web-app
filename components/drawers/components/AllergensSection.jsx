import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import InfoIcon from '../../common/InfoIcon';
import { ALLERGENS_OPTIONS } from '../../../utility/bagDrawerUtils';

const AllergensSection = ({ selectedAllergens, setSelectedAllergens }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAllergen = (allergen) => {
    if (selectedAllergens.includes(allergen)) {
      setSelectedAllergens(selectedAllergens.filter(item => item !== allergen));
    } else {
      setSelectedAllergens([...selectedAllergens, allergen]);
    }
  };

  return (
    <div className="mb-8">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center gap-2 mb-3 text-left focus:outline-none focus:ring-2 focus:ring-purple-200 focus:ring-offset-1 rounded-lg -m-1 p-1"
      >
        <ChevronDownIcon
          className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
        <h3 className="text-lg font-semibold text-gray-900">Allergens</h3>
        <InfoIcon content="Select allergens present in your item to help customers with dietary restrictions" />
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ALLERGENS_OPTIONS.map((allergen) => {
          const isSelected = selectedAllergens.includes(allergen.value);
          
          return (
            <button
              key={allergen.value}
              type="button"
              onClick={() => toggleAllergen(allergen.value)}
              className={`
                flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all duration-200
                ${isSelected 
                  ? 'bg-purple-50 border-purple-200 text-purple-700' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <span className="text-sm flex-shrink-0">{allergen.emoji}</span>
              <span className="text-xs font-medium truncate">{allergen.label}</span>
            </button>
          );
        })}
      </div>

          {selectedAllergens.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5 animate-fade-in">
              {selectedAllergens.map((allergen, index) => {
                const allergenData = ALLERGENS_OPTIONS.find(a => a.value === allergen);

                return (
                  <span
                    key={allergen}
                    className="inline-flex items-center gap-1.5 px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-md"
                    style={{
                      animation: `fadeIn 0.15s ease-out ${index * 0.03}s both`
                    }}
                  >
                    <span className="text-sm">{allergenData?.emoji}</span>
                    {allergenData?.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllergensSection;