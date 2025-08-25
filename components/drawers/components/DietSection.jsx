import React from 'react';
import InfoIcon from '../../common/InfoIcon';

const DietSection = ({ isVeg, setIsVeg, isNonVeg, setIsNonVeg }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Diet Options</h3>
        <InfoIcon content="Choose dietary preferences for your item" />
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center space-x-8">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={isVeg}
              onChange={() => setIsVeg(!isVeg)}
              className="w-5 h-5 text-[#5F22D9] bg-gray-100 border-gray-300 rounded focus:ring-[#5F22D9] focus:ring-2"
            />
            <span className="text-sm font-medium text-gray-700">Vegetarian</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={isNonVeg}
              onChange={() => setIsNonVeg(!isNonVeg)}
              className="w-5 h-5 text-[#5F22D9] bg-gray-100 border-gray-300 rounded focus:ring-[#5F22D9] focus:ring-2"
            />
            <span className="text-sm font-medium text-gray-700">Non-Vegetarian</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default DietSection;
