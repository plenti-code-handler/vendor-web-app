// vendor-web-app/components/sections/bussiness/profile/PayoutThresholdSection.jsx
import React from 'react';
import { HandRaisedIcon } from '@heroicons/react/24/outline';
import { mround } from '../../../../utility/priceCalculations';

const PayoutThresholdSection = ({ tier, smallBagPrice }) => {
  if (!smallBagPrice) return null;
  const threshold = mround(25 * smallBagPrice, 500);

  return (
    <div className="mt-10 flex justify-center">
      <div className="max-w-xl w-full bg-gradient-to-r from-[#5F22D9]/10 to-[#5F22D9]/5 border border-[#5F22D9]/20 rounded-2xl p-6 shadow-lg animate-fade-in">
        <div className="flex items-center space-x-3 mb-2">
          <HandRaisedIcon className="w-6 h-6 text-[#5F22D9]" />
          <h3 className="font-bold text-[#5F22D9] text-lg">
            Payout Threshold for {tier} Vendors
          </h3>
        </div>
        <div className="text-gray-700 text-base mb-2">
          <span className="font-semibold">Threshold:</span>{" "}
          <span className="text-[#5F22D9] font-bold text-xl">₹{threshold}</span>
        </div>
        <div className="text-xs text-gray-500">
          <span>
            Calculated as <span className="font-mono">MROUND(25 × small bag price, 500)</span>
          </span>
          <br />
          <span>
            Maintain this balance for unlimited withdrawal requests.
          </span>
        </div>
      </div>
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
};

export default PayoutThresholdSection;