"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { 
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { fetchVendorDetails, selectVendorData } from '../../../redux/slices/vendorSlice';
import axiosClient from '../../../AxiosClient';
import AuthLeftContent from '../../../components/layouts/AuthLeftContent';
import BeatLoader from 'react-spinners/BeatLoader';
import OnboardingTimeline from '../../../components/common/OnboardingTimeLine';
import { toast } from 'sonner';

const AccountApprovedPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const vendorData = useSelector(selectVendorData);
  
  const [isActivating, setIsActivating] = useState(false);
  const [activationStatus, setActivationStatus] = useState(null); // 'success', 'error', null
  const [hasAttemptedActivation, setHasAttemptedActivation] = useState(false);

  // Attempt activation when page loads
  // Attempt activation when page loads
useEffect(() => {
  // If account is already active, show success immediately
  if (vendorData?.is_active) {
    if (activationStatus !== 'success') {
      setActivationStatus('success');
    }
    return;
  }

  // Only attempt once and only if we haven't attempted yet
  if (hasAttemptedActivation || isActivating) {
    return;
  }

  const attemptActivation = async () => {
    setIsActivating(true);
    setHasAttemptedActivation(true);

    try {
      const activateResponse = await axiosClient.patch('/v1/vendor/me/account/activate');
      console.log(activateResponse, "!!!!!!");
      if (activateResponse.status === 200) {
        // Fetch vendor data after successful activation
        await dispatch(fetchVendorDetails()).unwrap();
        setActivationStatus('success');
        toast.success("Account activated successfully!");

      } else {
        console.log(activateResponse, "Error activating account!!!!!!");
        setActivationStatus('error');
      }
    } catch (error) {
      console.error("Error activating account:", error);
      setActivationStatus('error');
    } finally {
      setIsActivating(false);
    }
  };

  attemptActivation();
}, [vendorData?.is_active, hasAttemptedActivation, isActivating, dispatch, router, activationStatus]);

  const handleBackToLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("logo");
    router.push("/");
  };

  // Loading state while activating
  if (isActivating) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/Background.png')" }}
      >
        <div className="flex flex-col lg:flex-row pt-5 pb-5 justify-between px-10">
          <AuthLeftContent />
          <div className="flex flex-col w-full lg:w-[60%] bg-white lg:h-[95vh] max-h-[800px] rounded-[24px] shadow-lg overflow-hidden mt-20">
            <OnboardingTimeline currentStep={5} />
            <div className="flex flex-col justify-center items-center flex-1 px-6 pb-6 md:pb-10 lg:p-6 h-auto overflow-y-auto">
              <BeatLoader color="#5F22D9" size={10} />
              <p className="mt-4 text-gray-600 text-sm">Activating your account...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Determine what to show
  const showSuccess = activationStatus === 'success';
  const showError = activationStatus === 'error';

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
          <OnboardingTimeline currentStep={6} />

          {/* Content Area */}
          <div className="flex flex-col justify-start items-center flex-1 px-6 pb-6 md:pb-10 lg:p-6 h-auto overflow-y-auto">
            <div className="w-full max-w-md py-10">
              {/* Animated Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
                    showSuccess ? 'bg-green-100 scale-110' : showError ? 'bg-orange-100' : 'bg-purple-100'
                  }`}>
                    {showSuccess ? (
                      <CheckCircleIcon className="w-10 h-10 text-green-600" />
                    ) : showError ? (
                      <ClockIcon className="w-10 h-10 text-orange-600" />
                    ) : (
                      <CheckCircleIcon className="w-10 h-10 text-[#5F22D9]" />
                    )}
                  </div>
                  {showSuccess && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center bg-green-600">
                      <CheckCircleIcon className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                  {showSuccess 
                    ? 'Account Activated! 🎉' 
                    : showError 
                    ? 'Account Approved' 
                    : 'Account Approved! 🎉'}
                </h1>
                <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                  {showSuccess 
                    ? "Congratulations! Your Plenti account has been activated. Redirecting you to the dashboard..."
                    : showError
                    ? "We're still reviewing your account details. This usually takes 24-48 hours. You'll receive an email notification once your account is fully activated."
                    : "Congratulations! Your Plenti account has been approved. Please wait while we activate your account..."}
                </p>

                {/* Action Buttons */}
                {showSuccess && (
                  <div className="space-y-3">
                    <button
                      onClick={() => router.push("/business")}
                      className="w-full bg-[#5F22D9] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#4A1BB8] transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 shadow-lg"
                    >
                      <span>Go to Dashboard</span>
                      <ArrowRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                )}

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

export default AccountApprovedPage;