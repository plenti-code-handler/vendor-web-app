"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ArrowLeftIcon,
  EnvelopeIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { fetchVendorDetails, selectVendorData } from '../../redux/slices/vendorSlice';
import axiosClient from '../../AxiosClient';

// Step status helper
const getStepStatus = (stepId, currentStep, hasPricing, isApproved) => {
  const conditions = {
    1: 'completed',
    2: hasPricing ? (currentStep >= 2 ? 'completed' : 'pending') : 'pending',
    3: isApproved ? (currentStep >= 3 ? 'completed' : 'pending') : (currentStep >= 3 ? 'active' : 'pending'),
    4: isApproved ? (currentStep >= 4 ? 'completed' : 'pending') : 'pending'
  };
  return conditions[stepId];
};

// Check if catalogue has pricing data
const checkCataloguePricing = (catalogue) => {
  return catalogue?.item_types && Object.keys(catalogue.item_types).length > 0;
};

const AccountProcessingPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [vendorDetails, setVendorDetails] = useState(null);
  const [hasPricing, setHasPricing] = useState(false);
  const [isAccountApproved, setIsAccountApproved] = useState(false);
  
  const vendorData = useSelector(selectVendorData);

  // Fetch pricing status
  const fetchPricingStatus = async () => {
    try {
      const response = await axiosClient.get('/v1/vendor/catalogue/get_request');
      if (response.status === 200 && response.data) {
        return checkCataloguePricing(response.data);
      }
    } catch (error) {
      console.log('No pricing request found:', error);
    }
    return false;
  };

  // Load vendor data and pricing status
  const loadAccountData = async (existingVendorData = null) => {
    let details = existingVendorData;
    
    if (!details) {
      const result = await dispatch(fetchVendorDetails()).unwrap();
      details = result;
    }
    
    setVendorDetails(details);
    setIsAccountApproved(details.is_active || false);
    
    const pricingStatus = await fetchPricingStatus();
    setHasPricing(pricingStatus);
    
    return details;
  };

  // Initial load
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await loadAccountData(vendorData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading account data:', error);
        setLoading(false);
        // OnboardLayout will handle routing if token is invalid
        // Only redirect if there's a critical error
        const token = localStorage.getItem("token");
        if (!token) {
          router.push('/');
        }
      }
    };

    init();
  }, []);

  // Check if account becomes approved - OnboardLayout will handle redirect
  useEffect(() => {
    if (isAccountApproved && vendorDetails) {
      // OnboardLayout will automatically redirect to /business when is_active = true
      // We can trigger a refresh to let OnboardLayout handle routing
      // Or just let the user click the button
    }
  }, [isAccountApproved, vendorDetails]);

  // Sequential step animation
  useEffect(() => {
    if (loading || !vendorDetails) return;

    const timers = [];
    
    if (isAccountApproved) {
      // Approved: animate all steps sequentially
      timers.push(setTimeout(() => setCurrentStep(2), 1000));
      timers.push(setTimeout(() => setCurrentStep(3), 2000));
      timers.push(setTimeout(() => setCurrentStep(4), 3000));
    } else if (hasPricing) {
      // Pricing set: show pricing then review
      timers.push(setTimeout(() => setCurrentStep(2), 1000));
      timers.push(setTimeout(() => setCurrentStep(3), 2000));
    } else {
      // No pricing: skip to review
      timers.push(setTimeout(() => setCurrentStep(3), 1000));
    }

    return () => timers.forEach(clearTimeout);
  }, [loading, vendorDetails, hasPricing, isAccountApproved]);

  // Handlers
  const handleLogout = () => {
    ['token', 'user', 'logo'].forEach(key => localStorage.removeItem(key));
    router.push('/');
  };

  const handleGoToDashboard = () => {
    // OnboardLayout will handle routing, but we can trigger a refresh
    // to ensure OnboardLayout picks up the updated vendor state
    window.location.href = '/business';
  };
  
  const handleSetPricing = () => router.push('/price-decision');

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadAccountData();
      setTimeout(() => setRefreshing(false), 1000);
      
      // If account becomes approved after refresh, OnboardLayout will handle redirect
      // We could trigger a page reload to let OnboardLayout route, but the button
      // provides a better UX for immediate navigation
    } catch (error) {
      console.error('Error refreshing status:', error);
      setRefreshing(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5F22D9] mx-auto mb-4" />
          <p className="text-sm text-gray-600">Loading account details...</p>
        </div>
      </div>
    );
  }

  const STEPS = [
    { id: 1, title: 'Application submitted' },
    { id: 2, title: 'Pricing set' },
    { id: 3, title: 'Under review' },
    { id: 4, title: 'Account approved' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
          {/* Animated Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
                isAccountApproved ? 'bg-green-100 scale-110' :
                currentStep >= 3 ? 'bg-purple-100 scale-110' : 'bg-gray-100'
              }`}>
                {isAccountApproved ? (
                  <CheckCircleIcon className="w-10 h-10 text-green-600" />
                ) : (
                  <ClockIcon className={`w-10 h-10 transition-colors duration-500 ${
                    currentStep >= 3 ? 'text-[#5F22D9]' : 'text-gray-400'
                  }`} />
                )}
              </div>
              {(currentStep >= 3 || isAccountApproved) && (
                <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center animate-pulse ${
                  isAccountApproved ? 'bg-green-600' : 'bg-[#5F22D9]'
                }`}>
                  <CheckCircleIcon className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {isAccountApproved ? 'Account Approved! 🎉' : 'Account Under Review'}
            </h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {isAccountApproved 
                ? "Congratulations! Your Plenti account has been approved. You can now access your dashboard and start managing your surprise drops."
                : "We're currently processing your Plenti account. This usually takes 24-48 hours. You'll receive an email notification once your account is approved."
              }
            </p>

            {/* Progress Steps */}
            <div className="space-y-4 mb-8">
              {STEPS.map((step) => {
                const status = getStepStatus(step.id, currentStep, hasPricing, isAccountApproved);
                return (
                  <div key={step.id} className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
                      status === 'completed' ? 'bg-green-500 scale-110' :
                      status === 'active' ? 'bg-[#5F22D9] animate-pulse scale-110' :
                      'bg-gray-200'
                    }`}>
                      {status === 'completed' ? (
                        <CheckCircleIcon className="w-4 h-4 text-white" />
                      ) : status === 'active' ? (
                        <ClockIcon className="w-4 h-4 text-white" />
                      ) : (
                        <span className="text-xs text-gray-500">{step.id}</span>
                      )}
                    </div>
                    <span className={`text-sm transition-all duration-500 text-left ${
                      status === 'completed' ? 'text-gray-700 font-medium' :
                      status === 'active' ? 'text-[#5F22D9] font-semibold' :
                      'text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Contact Info */}
            {!isAccountApproved && (
              <div className="bg-purple-50 rounded-xl p-4 mb-6 border border-purple-100">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-gray-600">
                    Have questions about your application?
                  </p>
                </div>
                <p className="text-sm text-[#5F22D9] font-medium">
                  partner@plenti.co.in
                </p>
              </div>
            )}

            {/* Set Pricing Button */}
            {!hasPricing && !isAccountApproved && (
              <button
                onClick={handleSetPricing}
                className="w-full bg-[#5F22D9] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#4A1BB8] transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 mb-3"
              >
                <CurrencyDollarIcon className="w-5 h-5" />
                <span>Set Pricing (Required)</span>
              </button>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {!isAccountApproved && (
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    refreshing
                      ? 'bg-purple-100 text-purple-400 cursor-not-allowed'
                      : 'bg-purple-100 text-[#5F22D9] hover:bg-purple-200 hover:scale-105'
                  }`}
                >
                  <ArrowPathIcon className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>{refreshing ? 'Checking...' : 'Check Status'}</span>
                </button>
              )}

              {isAccountApproved ? (
                <button
                  onClick={handleGoToDashboard}
                  className="w-full bg-[#5F22D9] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#4A1BB8] transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 shadow-lg"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  disabled={refreshing}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  <span>Back to Login</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            © 2024 Plenti. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountProcessingPage;
