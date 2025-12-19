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
import AuthLeftContent from '../../components/layouts/AuthLeftContent';
import BeatLoader from 'react-spinners/BeatLoader';
import OnboardingTimeline from '../../components/common/OnboardingTimeLine';

// Check if catalogue has pricing data
const checkCataloguePricing = (catalogue) => {
  return catalogue?.item_types && Object.keys(catalogue.item_types).length > 0;
};

const AccountProcessingPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
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

  const handleBackToLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("logo");
    router.push("/");
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
        const token = localStorage.getItem("token");
        if (!token) {
          router.push('/');
        }
      }
    };

    init();
  }, []);

  // Handlers
  const handleGoToDashboard = () => {
    window.location.href = '/business';
  };
  

  const handleRefresh = async () => {
    await dispatch(fetchVendorDetails()).unwrap();
  };

  // Loading state
  if (loading) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/Background.png')" }}
      >
        <div className="flex flex-col lg:flex-row pt-5 pb-5 justify-between px-10">
          <AuthLeftContent />
          <div className="flex flex-col w-full lg:w-[60%] bg-white lg:h-[95vh] max-h-[800px] rounded-[24px] shadow-lg overflow-hidden mt-20">
            <OnboardingTimeline currentStep={2} />
            <div className="flex flex-col justify-center items-center flex-1 px-6 pb-6 md:pb-10 lg:p-6 h-auto overflow-y-auto">
              <BeatLoader color="#5F22D9" size={10} />
              <p className="mt-4 text-gray-600 text-sm">Loading account details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/Background.png')" }}
    >
      <div className="flex flex-col lg:flex-row pt-5 pb-5 justify-between px-10">
        <AuthLeftContent />

        <div className="flex flex-col w-full lg:w-[60%] bg-white lg:h-[95vh] max-h-[800px] rounded-[24px] shadow-lg overflow-hidden mt-20">
          {/* Back to Login Button */}
          <div className="ml-10 mt-10 items-start justify-start pr-10 gap-2">
            <button
              onClick={handleBackToLogin}
              className="text-sm text-[#5F22D9] hover:text-[#4A1BB8] font-medium transition-colors underline-offset-4 hover:underline flex items-center gap-2"
            >
              <ArrowLeftIcon className="h-3 w-3" />
              <span>Go Back to Login</span>
            </button>
          </div>

          {/* Onboarding Timeline */}
          <OnboardingTimeline currentStep={2} />

          {/* Content Area */}
          <div className="flex flex-col justify-start items-center flex-1 px-6 pb-6 md:pb-10 lg:p-6 h-auto overflow-y-auto">
            <div className="w-full max-w-md">
              {/* Animated Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isAccountApproved ? 'bg-green-100 scale-110' : 'bg-purple-100'
                  }`}>
                    {isAccountApproved ? (
                      <CheckCircleIcon className="w-10 h-10 text-green-600" />
                    ) : (
                      <ClockIcon className="w-10 h-10 text-[#5F22D9]" />
                    )}
                  </div>
                  {isAccountApproved && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center bg-green-600">
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
                <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                  {isAccountApproved 
                    ? "Congratulations! Your Plenti account has been approved. You can now access your dashboard and start managing your surprise drops."
                    : "We're currently processing your Plenti account. This usually takes 24-48 hours. You'll receive an email notification once your account is approved."
                  }
                </p>

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

                  {isAccountApproved && (
                    <button
                      onClick={handleGoToDashboard}
                      className="w-full bg-[#5F22D9] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#4A1BB8] transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 shadow-lg"
                    >
                      <span>Go to Dashboard</span>
                      <ArrowRightIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                  <p className="text-xs text-gray-400">
                    © 2024 Plenti. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountProcessingPage;