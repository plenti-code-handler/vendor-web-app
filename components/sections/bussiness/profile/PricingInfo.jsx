import React, { useState } from "react";
import { CurrencyDollarIcon, InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

const PricingInfo = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-r from-[#5F22D9]/5 to-[#5F22D9]/10 border border-[#5F22D9]/20 rounded-lg p-3 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-[#5F22D9]/10 rounded-md flex items-center justify-center">
              <CurrencyDollarIcon className="w-4 h-4 text-[#5F22D9]" />
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#5F22D9]">
              Pricing Update Process
            </h3>
            <p className="text-xs text-[#5F22D9]/70 mt-0.5">
              Learn how your pricing updates are processed
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-[#5F22D9] hover:text-[#4A1BB8] hover:bg-[#5F22D9]/10 rounded-md transition-all duration-200"
        >
          {isExpanded ? (
            <XMarkIcon className="w-3 h-3" />
          ) : (
            <InformationCircleIcon className="w-3 h-3" />
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-[#5F22D9]/20 space-y-1.5">
          <div className="flex items-start space-x-2">
            <div className="w-1 h-1 bg-[#5F22D9] rounded-full mt-1.5 flex-shrink-0"></div>
            <p className="text-xs text-[#5F22D9]/80">Changes will be reviewed by our team</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1 h-1 bg-[#5F22D9] rounded-full mt-1.5 flex-shrink-0"></div>
            <p className="text-xs text-[#5F22D9]/80">You'll be notified once approved or rejected</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1 h-1 bg-[#5F22D9] rounded-full mt-1.5 flex-shrink-0"></div>
            <p className="text-xs text-[#5F22D9]/80">Current prices remain active until approval</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingInfo;