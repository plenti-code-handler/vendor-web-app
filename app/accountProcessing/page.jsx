"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ArrowLeftIcon,
  EnvelopeIcon 
} from '@heroicons/react/24/outline';

// ✅ Add this to ensure CSS loads properly
// import 'tailwindcss/tailwind.css';

const AccountProcessingPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isMounted, setIsMounted] = useState(false); // ✅ Add mounting state

  useEffect(() => {
    setIsMounted(true); // ✅ Set mounted state
    
    // Simulate progress animation
    const timer = setTimeout(() => {
      setCurrentStep(2);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // ✅ Prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5F22D9]"></div>
      </div>
    );
  }

  const handleGoBack = () => {
    router.push('/');
    localStorage.clear();
  };

  const steps = [
    { id: 1, title: 'Application submitted', status: 'completed' },
    { id: 2, title: 'Under review', status: currentStep >= 2 ? 'active' : 'pending' },
    { id: 3, title: 'Account approved', status: 'pending' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
          {/* Animated Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
                currentStep >= 2 ? 'bg-purple-100 scale-110' : 'bg-gray-100'
              }`}>
                <ClockIcon className={`w-10 h-10 transition-colors duration-500 ${
                  currentStep >= 2 ? 'text-[#5F22D9]' : 'text-gray-400'
                }`} />
              </div>
              {currentStep >= 2 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#5F22D9] rounded-full flex items-center justify-center animate-pulse">
                  <CheckCircleIcon className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Account Under Review
            </h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We're currently processing your vendor account. This usually takes 24-48 hours. 
              You'll receive an email notification once your account is approved.
            </p>

            {/* Animated Progress Steps */}
            <div className="space-y-4 mb-8">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step.status === 'completed' ? 'bg-green-500' :
                    step.status === 'active' ? 'bg-[#5F22D9] animate-pulse' :
                    'bg-gray-200'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircleIcon className="w-4 h-4 text-white" />
                    ) : step.status === 'active' ? (
                      <ClockIcon className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-xs text-gray-500">{step.id}</span>
                    )}
                  </div>
                  <span className={`text-sm transition-colors duration-300 ${
                    step.status === 'completed' ? 'text-gray-700' :
                    step.status === 'active' ? 'text-[#5F22D9] font-medium' :
                    'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="bg-purple-50 rounded-xl p-4 mb-6 border border-purple-100">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                <p className="text-sm text-gray-600">
                  Have questions about your application?
                </p>
              </div>
              <p className="text-sm text-[#5F22D9] font-medium">
                support@plenti.co.in
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={handleGoBack}
              className="w-full bg-[#5F22D9] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#4A1BB8] transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back to Login</span>
            </button>
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