// vendor-web-app/components/sections/bussiness/profile/PriceCard.jsx
import React from 'react';
import { SmallBagIcon, MediumBagIcon, LargeBagIcon } from '../../../../svgs';

const PriceCard = ({ size, prices, isMedium, showCards, index, scale = 1, zIndex = 1 }) => {
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

  // Calculate padding and font sizes - smaller for compact fit
  const padding = 'p-6';
  const iconSize = 'w-10 h-10';
  const priceSize = 'text-3xl';
  const textSize = 'text-xs';

  return (
    <div
      className={`relative transition-all duration-700 ${
        showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ 
        transitionDelay: `${index * 200}ms`,
        transform: showCards ? `scale(${scale})` : 'scale(0.9)',
        zIndex: zIndex,
        transformOrigin: 'center'
      }}
    >
      <div className={`rounded-3xl ${padding} h-full transition-transform duration-300  ${
        isMedium 
          ? 'bg-gradient-to-br from-[#5F22D9]/5 to-[#5F22D9]/10 border border-[#5F22D9]/20 shadow-xl' 
          : 'bg-white border border-gray-100 shadow-lg'
      }`}>
        <div className="text-center space-y-4">
          <div className={`${iconSize} rounded-full ${getBackgroundClass()} flex items-center justify-center mx-auto`}>
            <div className={getTextColor()}>
              {getIcon()}
            </div>
          </div>
          
          <div className="space-y-1.5">
            <p className={`${textSize} uppercase tracking-wide font-medium ${
              isMedium ? 'text-[#5F22D9]/70' : 'text-gray-500'
            }`}>
              {size} Bag
            </p>
            <div className={`${priceSize} font-semibold ${
              isMedium ? 'text-[#5F22D9]' : 'text-gray-900'
            }`}>
              ₹{prices[size].price}
            </div>
          </div>

          <div className={`space-y-2 ${textSize} ${
            isMedium ? 'text-[#5F22D9]/80' : 'text-gray-600'
          }`}>
            <p className="font-medium">
              Serves {prices[size].serves}
            </p>
            
            <div className="space-y-1.5">
              <div className={`flex justify-between items-center py-1.5 ${
                isMedium ? 'border-b border-[#5F22D9]/20' : 'border-b border-gray-100'
              }`}>
                <span>Our cut:</span>
                <span className="font-semibold text-red-600">₹{prices[size].cut}</span>
              </div>
              
              <div className="flex justify-between items-center py-1.5">
                <span>You earn:</span>
                <span className={`font-semibold ${
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