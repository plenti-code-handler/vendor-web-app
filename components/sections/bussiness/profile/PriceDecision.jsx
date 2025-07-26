// vendor-web-app/components/sections/bussiness/profile/PriceDecision.jsx
"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  ArrowLeftIcon,
  CurrencyDollarIcon,
  CalculatorIcon,
  SparklesIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';
import { calculatePrices, getTierInfo } from '../../../../utility/priceCalculations';
import PriceCard from './PriceCard';
import PayoutThresholdSection from './PayoutThresholdSection';
import CategorySelection from './CategorySelection';
import { SmallBagIcon, MediumBagIcon, LargeBagIcon } from '../../../../svgs';
const PriceDecision = () => {
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [averagePrice, setAveragePrice] = useState('');
  const [activeTab, setActiveTab] = useState('MEAL');
  const [showCards, setShowCards] = useState(false);

  const categories = [
    { id: 'MEAL', name: 'Meals', icon: '🍽️', description: 'Full meals and main courses' },
    { id: 'BAKED_GOODS', name: 'Baked Goods', icon: '🥐', description: 'Bread, pastries, and baked items' },
    { id: 'SNACKS_AND_DESSERT', name: 'Snacks & Desserts', icon: '��', description: 'Snacks, desserts, and treats' }
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
  };

  const handleSubmit = () => {
    toast.success('Price decision submitted successfully!');
    setStep(1);
    setSelectedCategories([]);
    setAveragePrice('');
    setActiveTab('MEAL');
    setShowCards(false);
  };

  const prices = calculatePrices(averagePrice, activeTab);
  const tierInfo = getTierInfo(averagePrice);

  useEffect(() => {
    if (step === 2 && averagePrice && prices) {
      const timer = setTimeout(() => setShowCards(true), 300);
      return () => clearTimeout(timer);
    }
  }, [step, averagePrice, prices]);

  if (step === 1) {
    return (
      <CategorySelection
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryToggle={handleCategoryToggle}
        onNext={handleNext}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
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
                    Average Selling Price (ASP)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CurrencyRupeeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={averagePrice}
                      onChange={(e) => setAveragePrice(e.target.value)}
                      placeholder="Enter your average menu price"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  {averagePrice && (
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${tierInfo.color}`}>
                      {tierInfo.name} TIER
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
                        onClick={() => setActiveTab(categoryId)}
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
                  disabled={!averagePrice || !prices}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    averagePrice && prices
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
          {averagePrice && prices ? (
            <>
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {categories.find(c => c.id === activeTab)?.name} Pricing
                  </h2>
                  <p className="text-gray-600">
                    Based on your average selling price of ₹{averagePrice}
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

              {/* --- Independent Payout Threshold Section BELOW the cards --- */}
              <PayoutThresholdSection 
                tier={tierInfo.name}
                smallBagPrice={calculatePrices(averagePrice, 'MEAL')?.small.price}
              />
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <CalculatorIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Enter your average price
              </h3>
              <p className="text-gray-600">
                We'll calculate optimal pricing for your selected categories
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceDecision;