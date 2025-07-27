// vendor-web-app/components/sections/bussiness/profile/PriceDecision.jsx
"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  ArrowLeftIcon,
  CurrencyDollarIcon,
  CalculatorIcon,
  SparklesIcon,
  CurrencyRupeeIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { calculatePrices, getTierInfo } from '../../../../utility/priceCalculations';
import PriceCard from './PriceCard';
import PayoutThresholdSection from './PayoutThresholdSection';
import CategorySelection from './CategorySelection';
import { SmallBagIcon, MediumBagIcon, LargeBagIcon } from '../../../../svgs';

const PriceDecision = () => {
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [averagePrices, setAveragePrices] = useState({});
  const [activeTab, setActiveTab] = useState('MEAL');
  const [showCards, setShowCards] = useState(false);
  const [showSnacksInfo, setShowSnacksInfo] = useState(false);

  const categories = [
    { id: 'MEAL', name: 'Meals', icon: '🥗', description: 'Full meals and main courses' },
    { id: 'BAKED_GOODS', name: 'Baked Goods', icon: '🥐', description: 'Bread, pastries, and baked items' },
    { id: 'SNACKS_AND_DESSERT', name: 'Snacks & Desserts', icon: '🍿', description: 'Snacks, desserts, and treats' }
  ];

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleNext = () => {
    if (selectedCategories.length === 0) {
      toast.error('Please select at least one category');
      return;
    }
    setStep(2);
    setActiveTab(selectedCategories[0]);
  };

  const handleBack = () => {
    setStep(1);
    setShowCards(false);
    setShowSnacksInfo(false);
  };

  const handleSubmit = () => {
    toast.success('Price decision submitted successfully!');
    setStep(1);
    setSelectedCategories([]);
    setAveragePrices({});
    setActiveTab('MEAL');
    setShowCards(false);
    setShowSnacksInfo(false);
  };

  // Get current average price for active tab
  const currentAveragePrice = averagePrices[activeTab] || '';
  
  // Calculate prices based on current category and its ASP
  const prices = calculatePrices(currentAveragePrice, activeTab);
  const tierInfo = getTierInfo(currentAveragePrice);

  // Handle average price change
  const handleAveragePriceChange = (value) => {
    if (activeTab === 'SNACKS_AND_DESSERT') {
      // Show info message for snacks and desserts
      setShowSnacksInfo(true);
      setTimeout(() => setShowSnacksInfo(false), 3000); // Hide after 3 seconds
      return;
    }
    
    setAveragePrices(prev => ({
      ...prev,
      [activeTab]: value
    }));
  };

  // Handle category tab change
  const handleCategoryTabChange = (categoryId) => {
    setActiveTab(categoryId);
    setShowCards(false);
    setShowSnacksInfo(false);
  };

  // Check if we should show cards
  const shouldShowCards = () => {
    if (activeTab === 'SNACKS_AND_DESSERT') {
      return true; // Always show for snacks and desserts
    }
    return currentAveragePrice && prices;
  };

  useEffect(() => {
    if (step === 2 && shouldShowCards()) {
      const timer = setTimeout(() => setShowCards(true), 300);
      return () => clearTimeout(timer);
    }
  }, [step, currentAveragePrice, prices, activeTab]);

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 items-center px-4">
        <div className="w-full max-w-2xl mx-auto justify-center">
          <CategorySelection
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
            onNext={handleNext}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-[#5F22D9] hover:text-[#4A1BB8] transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back to categories</span>
            </button>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900">Set Your Pricing</h1>
              <p className="text-gray-600">Configure pricing for your selected categories</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Average Serving Price for {categories.find(c => c.id === activeTab)?.name}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CurrencyRupeeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        value={currentAveragePrice}
                        onChange={(e) => handleAveragePriceChange(e.target.value)}
                        placeholder={activeTab === 'SNACKS_AND_DESSERT' 
                          ? "Fixed pricing - no input needed" 
                          : "Enter your average menu price"
                        }
                        className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200 ${
                          activeTab === 'SNACKS_AND_DESSERT' ? 'bg-gray-50 cursor-not-allowed' : ''
                        }`}
                        disabled={activeTab === 'SNACKS_AND_DESSERT'}
                      />
                    </div>
                    
                    {/* Info message for snacks and desserts */}
                    {showSnacksInfo && (
                      <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <InformationCircleIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <p className="text-sm text-blue-700">
                          Prices are fixed for Snacks & Desserts category
                        </p>
                      </div>
                    )}
                    
                    {currentAveragePrice && activeTab !== 'SNACKS_AND_DESSERT' && (
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${tierInfo.color}`}>
                        {tierInfo.name} TIER
                      </div>
                    )}
                    {activeTab === 'SNACKS_AND_DESSERT' && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        FIXED PRICING
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((categoryId) => {
                      const category = categories.find(c => c.id === categoryId);
                      return (
                        <button
                          key={categoryId}
                          onClick={() => handleCategoryTabChange(categoryId)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            activeTab === categoryId
                              ? 'bg-[#5F22D9] text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {category.icon} {category.name}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!shouldShowCards()}
                    className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      shouldShowCards()
                        ? 'bg-[#5F22D9] text-white hover:bg-[#4A1BB8] shadow-lg hover:shadow-xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <CalculatorIcon className="w-5 h-5" />
                    <span>Submit Pricing</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Price Cards Section */}
            {shouldShowCards() ? (
              <>
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {categories.find(c => c.id === activeTab)?.name} Pricing
                    </h2>
                    <p className="text-gray-600">
                      {activeTab === 'SNACKS_AND_DESSERT' 
                        ? 'Fixed pricing for all vendors'
                        : `Based on your average selling price of ₹${currentAveragePrice}`
                      }
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {['small', 'medium', 'large'].map((size, index) => (
                      <PriceCard
                        key={size}
                        size={size}
                        prices={prices}
                        isMedium={size === 'medium'}
                        showCards={showCards}
                        index={index}
                      />
                    ))}
                  </div>
                </div>

                {/* Independent Payout Threshold Section */}
                <PayoutThresholdSection 
                  tier={tierInfo.name}
                  smallBagPrice={calculatePrices(averagePrices['MEAL'] || currentAveragePrice, 'MEAL')?.small.price}
                />
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <CalculatorIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {activeTab === 'SNACKS_AND_DESSERT' 
                    ? 'Snacks & Desserts pricing is ready'
                    : 'Enter your average price'
                  }
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'SNACKS_AND_DESSERT'
                    ? 'Fixed pricing is automatically applied'
                    : 'We\'ll calculate optimal pricing for your selected categories'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceDecision;