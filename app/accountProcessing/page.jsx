"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ClockIcon, 
  ArrowLeftIcon,
  EnvelopeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { fetchVendorDetails } from '../../redux/slices/vendorSlice';
import AuthLeftContent from '../../components/layouts/AuthLeftContent';
import OnboardingTimeline from '../../components/common/OnboardingTimeLine';

const AccountProcessingPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const handleBackToLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("logo");
    router.push("/");
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchVendorDetails()).unwrap();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

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
          <OnboardingTimeline currentStep={3} />

          {/* Content Area */}
          <div className="flex flex-col justify-start items-center flex-1 px-6 pb-6 md:pb-10 lg:p-6 h-auto overflow-y-auto">
            <div className="w-full max-w-md">
              {/* Animated Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center bg-purple-100">
                    <ClockIcon className="w-10 h-10 text-[#5F22D9]" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                  Account Under Review
                </h1>
                <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                  We're currently processing your Plenti account. This usually takes 24-48 hours. You'll receive an email notification once your account is approved.
                </p>

                {/* Contact Info */}
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

                {/* Action Buttons */}
                <div className="space-y-3">
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