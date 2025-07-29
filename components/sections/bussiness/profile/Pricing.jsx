"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCatalogue, clearCatalogueError } from '../../../../redux/slices/catalogueSlice';
import { toast } from 'sonner';
import axiosClient from '../../../../AxiosClient';
import { ALL_ITEM_TYPES, ITEM_TYPE_DISPLAY_NAMES } from '../../../../constants/itemTypes';
import { 
  CurrencyDollarIcon, 
  ArrowPathIcon,
  SparklesIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';
import PriceRow from "./PriceRow";
import PricingInfo from "./PricingInfo";

const Pricing = () => {
  const dispatch = useDispatch();
  const { itemTypes, payout, loading, error, lastUpdated } = useSelector((state) => state.catalogue);

  const bagSizes = ['SMALL', 'MEDIUM', 'LARGE'];

  const [editingPrices, setEditingPrices] = useState({});
  const [tempPrices, setTempPrices] = useState({});
  const [localItemTypes, setLocalItemTypes] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!lastUpdated && !loading) {
      dispatch(fetchCatalogue());
    }
  }, [dispatch, lastUpdated, loading]);

  useEffect(() => {
    setLocalItemTypes(itemTypes);
  }, [itemTypes]);

  useEffect(() => {
    if (error) {
      const errorMessage = typeof error === 'string' ? error : error?.detail || error?.message || 'An error occurred';
      toast.error(errorMessage);
      dispatch(clearCatalogueError());
    }
  }, [error, dispatch]);

  const handleEditPrice = (itemType, bagSize) => {
    const currentPrice = localItemTypes[itemType]?.bags?.[bagSize] || '';
    setEditingPrices(prev => ({ ...prev, [`${itemType}-${bagSize}`]: true }));
    setTempPrices(prev => ({ ...prev, [`${itemType}-${bagSize}`]: currentPrice }));
  };

  const handleSavePrice = (itemType, bagSize) => {
    const newPrice = tempPrices[`${itemType}-${bagSize}`];
    if (newPrice && newPrice > 0) {
      setEditingPrices(prev => ({ ...prev, [`${itemType}-${bagSize}`]: false }));
      setLocalItemTypes(prev => ({
        ...prev,
        [itemType]: {
          ...prev[itemType],
          bags: {
            ...prev[itemType]?.bags,
            [bagSize]: newPrice
          }
        }
      }));
    }
  };

  const handleCancelEdit = (itemType, bagSize) => {
    setEditingPrices(prev => ({ ...prev, [`${itemType}-${bagSize}`]: false }));
    setTempPrices(prev => ({ ...prev, [`${itemType}-${bagSize}`]: undefined }));
  };

  const handleAddPrice = (itemType, bagSize) => {
    setEditingPrices(prev => ({
      ...prev,
      [`${itemType}-${bagSize}`]: true
    }));
    setTempPrices(prev => ({
      ...prev,
      [`${itemType}-${bagSize}`]: ''
    }));
  };

  const handleSaveAddedPrice = (itemType, bagSize) => {
    const newPrice = tempPrices[`${itemType}-${bagSize}`];
    if (newPrice && newPrice > 0) {
      setLocalItemTypes(prev => ({
        ...prev,
        [itemType]: {
          ...prev[itemType],
          bags: {
            ...prev[itemType]?.bags,
            [bagSize]: newPrice
          }
        }
      }));
      setEditingPrices(prev => ({ ...prev, [`${itemType}-${bagSize}`]: false }));
    }
  };

  const handleCancelAddedPrice = (itemType, bagSize) => {
    setEditingPrices(prev => ({ ...prev, [`${itemType}-${bagSize}`]: false }));
    setTempPrices(prev => ({ ...prev, [`${itemType}-${bagSize}`]: undefined }));
  };

  // Validation function to check if all bag sizes are filled for a category
  const validateCategory = (itemType) => {
    const itemTypeData = localItemTypes[itemType];
    if (!itemTypeData || !itemTypeData.bags) return false;
    
    return bagSizes.every(bagSize => {
      const price = itemTypeData.bags[bagSize];
      return price && price > 0;
    });
  };

  // Check if any category has all bag sizes filled
  const hasValidCategories = () => {
    return ALL_ITEM_TYPES.some(itemType => validateCategory(itemType));
  };

  const handleRequestUpdate = async () => {
    try {
      setIsSubmitting(true);

      // Validate that at least one category has all bag sizes filled
      if (!hasValidCategories()) {
        toast.error('Please fill all bag sizes for at least one category before submitting.');
        return;
      }

      const updateData = {
        item_types: {}
      };

      // Process each item type - only include categories with all bag sizes filled
      ALL_ITEM_TYPES.forEach(itemType => {
        if (validateCategory(itemType)) {
          const itemTypeData = localItemTypes[itemType];
          updateData.item_types[itemType] = {
            asp: itemTypeData.asp || 0, // Include ASP if available
            bags: {}
          };
          
          // Add all bag prices for this category
          bagSizes.forEach(bagSize => {
            const price = itemTypeData.bags[bagSize];
            updateData.item_types[itemType].bags[bagSize] = price;
          });
        }
      });

      // Include payout data if available
      if (payout && Object.keys(payout).length > 0) {
        updateData.payout = payout;
      }

      console.log(updateData);
      const response = await axiosClient.post('/v1/vendor/catalogue/request', updateData);
      
      if (response.status === 200) {
        toast.success('Pricing update request submitted successfully!');
        // Refresh the catalogue data
        dispatch(fetchCatalogue());
      } else {
        toast.error('Failed to submit pricing update request');
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.detail || 
                          error?.response?.data?.message || 
                          error?.message || 
                          'Failed to submit pricing update request';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <ArrowPathIcon className="w-5 h-5 animate-spin text-[#5F22D9]" />
          </div>
          <span className="text-sm text-gray-600 font-medium">Loading pricing information...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#5F22D9] rounded-lg flex items-center justify-center">
            <CurrencyRupeeIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-900">Pricing Management</h1>
        </div>
        <p className="text-sm text-gray-600">
          Set and manage your pricing for different item types and bag sizes
        </p>
      </div>

      {/* Payout Information Display */}
      {payout && Object.keys(payout).length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CurrencyRupeeIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-blue-900">Payout Information</h3>
          </div>
          <div className="text-sm text-blue-800">
            <p>Threshold: <span className="font-medium">₹{payout.threshold}</span></p>
            <p>Keep this balance for unlimited payouts</p>
          </div>
        </div>
      )}

      {/* All Categories Tables */}
      <div className="space-y-6">
        {ALL_ITEM_TYPES.map((itemType) => {
          const itemTypeData = localItemTypes[itemType];
          return (
            <div key={itemType} className="w-full">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <SparklesIcon className="w-4 h-4 text-[#5F22D9]" />
                      <h3 className="text-base font-semibold text-gray-900">
                        {ITEM_TYPE_DISPLAY_NAMES[itemType]} Pricing
                      </h3>
                      {itemTypeData?.asp && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          ASP: ₹{itemTypeData.asp}
                        </span>
                      )}
                    </div>
                    {validateCategory(itemType) && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Complete
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {bagSizes.map((bagSize) => (
                    <PriceRow
                      key={bagSize}
                      bagSize={bagSize}
                      itemType={itemType}
                      isEditing={editingPrices[`${itemType}-${bagSize}`]}
                      isAdding={editingPrices[`${itemType}-${bagSize}`]}
                      currentPrice={itemTypeData?.bags?.[bagSize]}
                      tempPrice={tempPrices[`${itemType}-${bagSize}`]}
                      onEdit={handleEditPrice}
                      onSave={handleSavePrice}
                      onCancel={handleCancelEdit}
                      onAdd={handleAddPrice}
                      onSaveAdd={handleSaveAddedPrice}
                      onCancelAdd={handleCancelAddedPrice}
                      setTempPrices={setTempPrices}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Request Update Button */}
      <div className="pt-4">
        <button
          onClick={handleRequestUpdate}
          disabled={isSubmitting || !hasValidCategories()}
          className="flex items-center space-x-2 bg-[#5F22D9] hover:bg-[#4A1BB8] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl text-sm"
        >
          {isSubmitting && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
          <span>
            {isSubmitting 
              ? 'Submitting...' 
              : hasValidCategories() 
                ? 'Request Pricing Update' 
                : 'Fill all bag sizes for at least one category'
            }
          </span>
        </button>
      </div>

      {/* Info Section */}
      <div className="w-full">
        <PricingInfo />
      </div>
    </div>
  );
};

export default Pricing;