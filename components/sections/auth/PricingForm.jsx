"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axiosClient from '../../../AxiosClient';
import { 
  ArrowLeftIcon,
  CalculatorIcon,
  CurrencyRupeeIcon,
} from '@heroicons/react/24/outline';
import { getCategoriesForUI, ITEM_TYPES } from '../../../constants/itemTypes';
import { calculatePrices, getTierInfo, getPayoutTier, getPayoutThreshold } from '../../../utility/priceCalculations';
import PriceCard from '../../sections/bussiness/profile/PriceCard';
import PayoutThresholdSection from '../../sections/bussiness/profile/PayoutThresholdSection';
import CategorySelection from '../bussiness/profile/CategorySelection';


const PricingForm = ({ onSuccess, showBackButton = false }) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(ITEM_TYPES.MEAL);
  const [averagePrices, setAveragePrices] = useState({});
  const [showCards, setShowCards] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic categories from constants
  const categories = getCategoriesForUI();

  const handleCategorySelect = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
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

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Check if token exists
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required. Please login again.");
        router.push('/verify_email');
        return;
      }

      // Validate that all selected categories have average prices set
      const missingPrices = [];
      selectedCategories.forEach(categoryId => {
        const asp = averagePrices[categoryId];
        if (!asp || asp <= 0) {
          const categoryName = categories.find(c => c.id === categoryId)?.name || categoryId;
          missingPrices.push(categoryName);
        }
      });

      // If any categories are missing prices, show error and return early
      if (missingPrices.length > 0) {
        const errorMessage = missingPrices.length === 1
          ? `Please enter a valid average price for ${missingPrices[0]}`
          : `Please enter valid average prices for: ${missingPrices.join(', ')}`;
        toast.error(errorMessage);
        setIsSubmitting(false);
        return;
      }

      // Find the highest ASP across all categories
      let highestASP = 0;
      selectedCategories.forEach(categoryId => {
        const asp = parseFloat(averagePrices[categoryId]) || 0;
        if (asp > highestASP) {
          highestASP = asp;
        }
      });

      // Get payout tier based on the highest ASP
      const payoutTier = getPayoutTier(highestASP);

      // Curate the payload
      const payload = {
        item_types: {},
        payout: {
          tier: payoutTier,
          threshold: getPayoutThreshold(calculatePrices(highestASP, 'MEAL')?.small.price)
        }
      };

      // Process all categories - at this point we know all have valid prices
      selectedCategories.forEach(categoryId => {
        const asp = averagePrices[categoryId];
        const prices = calculatePrices(asp, categoryId);
        
        payload.item_types[categoryId] = {
          asp: asp,
          bags: {
            SMALL: prices.small.price,
            MEDIUM: prices.medium.price,
            LARGE: prices.large.price
          },
          cuts: {
            SMALL: prices.small.cut,
            MEDIUM: prices.medium.cut,
            LARGE: prices.large.cut
          }
        };
      });

      // Make API call
      const response = await axiosClient.post('/v1/vendor/catalogue/request', payload);
      
      if (response.status === 200) {
        toast.success('Pricing request submitted successfully!');
        if (onSuccess) {
          onSuccess();
        } else {
          router.back();
        }
      } else {
        toast.error('Failed to submit price decision');
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.detail || 
                          error?.response?.data?.message || 
                          error?.message || 
                          'Failed to submit price decision';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current average price for active tab
  const currentAveragePrice = averagePrices[activeTab] || '';
  
  // Calculate prices based on current category and its ASP
  const prices = calculatePrices(currentAveragePrice, activeTab);
  const tierInfo = getTierInfo(currentAveragePrice);

  // Calculate payout threshold based on highest ASP across all categories
  const calculatePayoutThreshold = () => {
    if (selectedCategories.length === 0) return null;
    
    // Find the highest ASP across all selected categories
    let highestASP = 0;
    selectedCategories.forEach(categoryId => {
      const asp = parseFloat(averagePrices[categoryId]) || 0;
      if (asp > highestASP) {
        highestASP = asp;
      }
    });

    // Calculate threshold using highest ASP (using MEAL category for calculation)
    if (highestASP > 0) {
      const smallBagPrice = calculatePrices(highestASP, 'MEAL')?.small.price;
      return smallBagPrice ? getPayoutThreshold(smallBagPrice) : null;
    }
    return null;
  };

  const payoutThreshold = calculatePayoutThreshold();

  // Handle average price change
  const handleAveragePriceChange = (value) => {
    setAveragePrices(prev => ({
      ...prev,
      [activeTab]: value
    }));
  };

  // Handle category tab change
  const handleCategoryTabChange = (categoryId) => {
    setActiveTab(categoryId);
    setShowCards(false);
  };

  // Check if we should show cards
  const shouldShowCards = () => {
    return currentAveragePrice && prices;
  };

  const handleWheel = (e) => {
    e.currentTarget.blur();
  };

  useEffect(() => {
    if (step === 2 && shouldShowCards()) {
      const timer = setTimeout(() => setShowCards(true), 300);
      return () => clearTimeout(timer);
    }
  }, [step, currentAveragePrice, prices, activeTab]);

  // Step 1: Category Selection
  if (step === 1) {
    return (
      <div className="w-full">
        <CategorySelection
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategorySelect}
          onNext={handleNext}
        />

      </div>
    );
  }

  // Step 2: Pricing Configuration
  return (
    <div className="w-full">
      {showBackButton && (
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-[#5F22D9] hover:text-[#4A1BB8] transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to categories</span>
          </button>
        </div>
      )}

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
                    placeholder="Enter your average menu price"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200"
                    onWheel={handleWheel}
                  />
                </div>
                
                {currentAveragePrice && (
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
                disabled={!shouldShowCards() || isSubmitting}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  shouldShowCards() && !isSubmitting
                    ? 'bg-[#5F22D9] text-white hover:bg-[#4A1BB8] shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CalculatorIcon className="w-5 h-5" />
                    <span>Submit Pricing</span>
                  </>
                )}
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
                  Based on your average selling price of ₹{currentAveragePrice}
                </p>
              </div>

              {/* Price cards container - all 3 cards fit horizontally */}
              <div className="flex items-center justify-center gap-3 px-2 sm:px-4">
                <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-4xl">
                  {['small', 'medium', 'large'].map((size, index) => (
                    <div key={size} className="w-full">
                      <PriceCard
                        size={size}
                        prices={prices}
                        isMedium={size === 'medium'}
                        showCards={showCards}
                        index={index}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Independent Payout Threshold Section */}
            {payoutThreshold && (
              <PayoutThresholdSection 
                threshold={payoutThreshold}
              />
            )}
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
  );
};

export default PricingForm;