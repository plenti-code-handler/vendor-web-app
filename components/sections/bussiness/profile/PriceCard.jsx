// vendor-web-app/components/sections/bussiness/profile/PriceCard.jsx
import React from 'react';
import { SmallBagIcon, MediumBagIcon, LargeBagIcon } from '../../../../svgs';

const PriceCard = ({ size, prices, isMedium, showCards, index }) => {
  const getIcon = () => {
    switch (size) {
      case 'small': return <SmallBagIcon />;
      case 'medium': return <MediumBagIcon />;
      case 'large': return <LargeBagIcon />;
      default: return null;
    }
  };

  const getBackgroundClass = () => {
    if (isMedium) return 'bg-[#5F22D9]/20';
    return size === 'small' ? 'bg-green-100' : 'bg-purple-100';
  };

  const getTextColor = () => {
    if (isMedium) return 'text-[#5F22D9]';
    return size === 'small' ? 'text-green-600' : 'text-purple-600';
  };

  return (
    <div
      className={`relative transform transition-all duration-700 hover:scale-105 ${
        showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {isMedium && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-[#5F22D9] text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg">
            ⭐ Most Popular
          </div>
        </div>
      )}

      <div className={`rounded-2xl p-8 h-full ${
        isMedium 
          ? 'bg-gradient-to-br from-[#5F22D9]/5 to-[#5F22D9]/10 border border-[#5F22D9]/20 shadow-xl' 
          : 'bg-white border border-gray-100 shadow-lg'
      }`}>
        <div className="text-center space-y-6">
          <div className={`w-12 h-12 rounded-full ${getBackgroundClass()} flex items-center justify-center mx-auto`}>
            <div className={getTextColor()}>
              {getIcon()}
            </div>
          </div>
          
          <div className="space-y-2">
            <p className={`text-sm uppercase tracking-wide font-medium ${
              isMedium ? 'text-[#5F22D9]/70' : 'text-gray-500'
            }`}>
              {size} Bag
            </p>
            <div className={`text-4xl font-bold ${
              isMedium ? 'text-[#5F22D9]' : 'text-gray-900'
            }`}>
              ₹{prices[size].price}
            </div>
          </div>

          <div className={`space-y-3 text-sm ${
            isMedium ? 'text-[#5F22D9]/80' : 'text-gray-600'
          }`}>
            <p className="font-medium">
              Serves {prices[size].serves}
            </p>
            
            <div className="space-y-2">
              <div className={`flex justify-between items-center py-2 ${
                isMedium ? 'border-b border-[#5F22D9]/20' : 'border-b border-gray-100'
              }`}>
                <span>Our cut:</span>
                <span className="font-semibold text-red-600">₹{prices[size].cut}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span>You earn:</span>
                <span className={`font-bold ${
                  isMedium ? 'text-[#5F22D9]' : 'text-gray-900'
                }`}>
                  ₹{prices[size].price - prices[size].cut}
                </span>
              </div>
            </div>
          </div>

          {!isMedium && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#5F22D9]/5 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceCard;