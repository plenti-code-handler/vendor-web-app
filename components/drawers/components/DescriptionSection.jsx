


import React from 'react';
import { Textarea } from "@headlessui/react";
import InfoIcon from '../../common/InfoIcon';

const DescriptionSection = ({ 
  description, 
  setDescription, 
  showCustomDescription, 
  setShowCustomDescription, 
  availableDescriptions 
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Item Description</h3>
        <InfoIcon content="Describe your item to attract customers" />
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
        {/* Description Type Selection */}
        <div className="mb-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="descriptionType"
                checked={!showCustomDescription}
                onChange={() => setShowCustomDescription(false)}
                className="w-4 h-4 text-[#5F22D9] bg-gray-100 border-gray-300 focus:ring-[#5F22D9] focus:ring-2"
              />
              <span className="text-sm font-medium text-gray-700">Use Existing Description</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="descriptionType"
                checked={showCustomDescription}
                onChange={() => setShowCustomDescription(true)}
                className="w-4 h-4 text-[#5F22D9] bg-gray-100 border-gray-300 focus:ring-[#5F22D9] focus:ring-2"
              />
              <span className="text-sm font-medium text-gray-700">Add New Description</span>
            </label>
          </div>
        </div>

        {/* Existing Descriptions Dropdown */}
        {!showCustomDescription && availableDescriptions.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select from existing descriptions:
            </label>
            <select
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="">-- Select a description --</option>
              {availableDescriptions.map((desc, index) => (
                <option key={index} value={desc}>
                  {desc}
                </option>
              ))}
            </select>
            
            {description && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 font-medium mb-1">Selected Description:</p>
                <p className="text-sm text-gray-800">{description}</p>
              </div>
            )}
          </div>
        )}

        {/* Custom Description Textarea */}
        {showCustomDescription && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your custom description:
            </label>
            <Textarea
              className="block w-full resize-none rounded-lg border border-gray-200 py-3 px-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200"
              rows={4}
              placeholder="Enter your custom description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        )}

        {/* Fallback for no existing descriptions */}
        {availableDescriptions.length === 0 && !showCustomDescription && (
          <div>
            <p className="text-sm text-gray-600 mb-3">No existing descriptions available.</p>
            <button
              onClick={() => setShowCustomDescription(true)}
              className="text-[#5F22D9] text-sm font-medium hover:underline transition-colors duration-200"
            >
              + Add custom description
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DescriptionSection;