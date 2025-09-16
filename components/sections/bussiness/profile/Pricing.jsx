"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCatalogue, clearCatalogueError } from '../../../../redux/slices/catalogueSlice';
import { toast } from 'sonner';
import axiosClient from '../../../../AxiosClient';
import { ALL_ITEM_TYPES, ITEM_TYPE_DISPLAY_NAMES } from '../../../../constants/itemTypes';
import { 
  ArrowPathIcon,
  SparklesIcon,
  CurrencyRupeeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { calculatePrices } from '../../../../utility/priceCalculations';
import PriceRow from "./PriceRow";
import PricingInfo from "./PricingInfo";

const Pricing = () => {
  const dispatch = useDispatch();
  const { itemTypes, payout, loading, error, lastUpdated } = useSelector((state) => state.catalogue);

  const bagSizes = ['SMALL', 'MEDIUM', 'LARGE'];

  const [localItemTypes, setLocalItemTypes] = useState({});
  const [originalItemTypes, setOriginalItemTypes] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingASP, setEditingASP] = useState({});
  const [tempASP, setTempASP] = useState({});
  const [pendingRequests, setPendingRequests] = useState({});

  useEffect(() => {
    if (!lastUpdated && !loading) {
      dispatch(fetchCatalogue());
    }
  }, [dispatch, lastUpdated, loading]);

  useEffect(() => {
    setLocalItemTypes(itemTypes);
    setOriginalItemTypes(itemTypes);
  }, [itemTypes]);

  // Fetch pending requests and compare with current ASP
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axiosClient.get('/v1/vendor/catalogue/get_request');
        if (response.status === 200 && response.data) {
          const requestData = response.data;
          const pending = {};
          
          // Compare ASP values between current and requested
          ALL_ITEM_TYPES.forEach(itemType => {
            const currentASP = localItemTypes[itemType]?.asp;
            const requestedASP = requestData.item_types?.[itemType]?.asp;
            
            if (requestedASP && currentASP !== requestedASP) {
              pending[itemType] = requestedASP;
            }
          });
          
          setPendingRequests(pending);
        }
      } catch (error) {
        console.log('No pending requests or error fetching requests:', error);
        setPendingRequests({});
      }
    };

    if (localItemTypes && Object.keys(localItemTypes).length > 0) {
      fetchPendingRequests();
    }
  }, [originalItemTypes]);

  useEffect(() => {
    if (error) {
      let errorMessage = 'An error occurred';
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (Array.isArray(error)) {
        errorMessage = error.map(err => err.msg || err.message || 'Validation error').join(', ');
      } else if (error && typeof error === 'object') {
        if (error.detail) {
          if (Array.isArray(error.detail)) {
            errorMessage = error.detail.map(err => err.msg || err.message || 'Validation error').join(', ');
          } else if (typeof error.detail === 'string') {
            errorMessage = error.detail;
          }
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.msg) {
          errorMessage = error.msg;
        }
      }
      
      toast.error(errorMessage);
      dispatch(clearCatalogueError());
    }
  }, [error, dispatch]);

  const handleEditASP = (itemType) => {
    const currentASP = localItemTypes[itemType]?.asp || '';
    setEditingASP(prev => ({ ...prev, [itemType]: true }));
    setTempASP(prev => ({ ...prev, [itemType]: currentASP }));
  };

  const handleSaveASP = (itemType) => {
    const newASP = tempASP[itemType];
    if (newASP && newASP > 0) {
      const aspValue = parseFloat(newASP);
      const calculatedPrices = calculatePrices(aspValue, itemType);
      
      setEditingASP(prev => ({ ...prev, [itemType]: false }));
      setLocalItemTypes(prev => ({
        ...prev,
        [itemType]: {
          ...prev[itemType],
          asp: aspValue,
          bags: calculatedPrices ? {
            SMALL: calculatedPrices.small.price,
            MEDIUM: calculatedPrices.medium.price,
            LARGE: calculatedPrices.large.price
          } : prev[itemType]?.bags || {},
          cuts: calculatedPrices ? {
            SMALL: calculatedPrices.small.cut,
            MEDIUM: calculatedPrices.medium.cut,
            LARGE: calculatedPrices.large.cut
          } : prev[itemType]?.cuts || {}
        }
      }));
    }
  };

  const handleCancelASP = (itemType) => {
    setEditingASP(prev => ({ ...prev, [itemType]: false }));
    setTempASP(prev => ({ ...prev, [itemType]: undefined }));
  };

  const handleRequestUpdate = async () => {
    try {
      setIsSubmitting(true);

      const updateData = { item_types: {} };

      ALL_ITEM_TYPES.forEach(itemType => {
        const itemTypeData = localItemTypes[itemType];
        
        if (itemTypeData && (itemTypeData.asp || itemTypeData.bags)) {
          updateData.item_types[itemType] = {
            asp: itemTypeData.asp || 0,
            bags: {},
            cuts: {}
          };
          
          bagSizes.forEach(bagSize => {
            const price = itemTypeData.bags?.[bagSize];
            const cut = itemTypeData.cuts?.[bagSize];
            
            if (price && price > 0) {
              updateData.item_types[itemType].bags[bagSize] = price;
            }
            if (cut && cut > 0) {
              updateData.item_types[itemType].cuts[bagSize] = cut;
            }
          });
        }
      });

      if (payout && Object.keys(payout).length > 0) {
        updateData.payout = payout;
      }

      console.log(updateData);
      const response = await axiosClient.post('/v1/vendor/catalogue/request', updateData);
      
      if (response.status === 200) {
        toast.success('Pricing update request submitted successfully!');
        dispatch(fetchCatalogue());
        // Refresh pending requests after successful submission
        setTimeout(() => {
          const fetchPendingRequests = async () => {
            try {
              const response = await axiosClient.get('/v1/vendor/catalogue/get_request');
              if (response.status === 200 && response.data) {
                const requestData = response.data;
                const pending = {};
                
                ALL_ITEM_TYPES.forEach(itemType => {
                  const currentASP = localItemTypes[itemType]?.asp;
                  const requestedASP = requestData.item_types?.[itemType]?.asp;
                  
                  if (requestedASP && currentASP !== requestedASP) {
                    pending[itemType] = requestedASP;
                  }
                });
                
                setPendingRequests(pending);
              }
            } catch (error) {
              setPendingRequests({});
            }
          };
          fetchPendingRequests();
        }, 1000);
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
          <ArrowPathIcon className="w-5 h-5 animate-spin text-[#5F22D9]" />
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
          View and edit your pricing for different item types and bag sizes
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
          const hasPendingRequest = pendingRequests[itemType];
          
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
                      <div className="flex items-center space-x-2">
                        {editingASP[itemType] ? (
                          <div className="flex items-center space-x-2">
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">₹</span>
                              <input
                                type="number"
                                value={tempASP[itemType] || ''}
                                onChange={(e) =>
                                  setTempASP(prev => ({
                                    ...prev,
                                    [itemType]: parseFloat(e.target.value) || 0,
                                  }))
                                }
                                className="pl-6 pr-2 py-1 w-20 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200"
                                min="0"
                                step="0.01"
                                autoFocus
                              />
                            </div>
                            <button
                              onClick={() => handleSaveASP(itemType)}
                              className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-all duration-200"
                            >
                              <CheckIcon className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleCancelASP(itemType)}
                              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-all duration-200"
                            >
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              ASP: ₹{itemTypeData?.asp || 'Not set'}
                            </span>
                            <button
                              onClick={() => handleEditASP(itemType)}
                              className="p-1 text-gray-600 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                            >
                              <PencilIcon className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      {hasPendingRequest && (
                        <div className="flex items-center space-x-1 text-indigo-800 px-2 py-1 rounded-md bg-gradient-to-r from-indigo-100 to-indigo-200">
                          <ClockIcon className="w-3 h-3" />
                          <span className="text-xs font-medium">
                            Your request for ASP update of ₹{hasPendingRequest} is being processed..
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {bagSizes.map((bagSize) => (
                    <PriceRow
                      key={bagSize}
                      bagSize={bagSize}
                      currentPrice={itemTypeData?.bags?.[bagSize]}
                      currentCut={itemTypeData?.cuts?.[bagSize]}
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
          disabled={isSubmitting}
          className="flex items-center space-x-2 bg-[#5F22D9] hover:bg-[#4A1BB8] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl text-sm"
        >
          {isSubmitting && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
          <span>
            {isSubmitting ? 'Submitting...' : 'Request Pricing Update'}
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