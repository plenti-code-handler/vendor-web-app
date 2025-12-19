"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronUpIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import AuthLeftContent from '../../components/layouts/AuthLeftContent';
import MOUContent from '../../components/sections/auth/MOUContent';
import BeatLoader from 'react-spinners/BeatLoader';
import axiosClient from '../../AxiosClient';
import OnboardingTimeline from '../../components/common/OnboardingTimeLine';
import { fetchVendorDetails } from '../../redux/slices/vendorSlice';
import { useDispatch } from 'react-redux';

const TermsAcceptancePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Check scroll position
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(Math.min(scrollPercentage, 100));

    // Consider "bottom" when 95% scrolled (for better UX)
    if (scrollPercentage >= 95) {
      setHasScrolledToBottom(true);
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Handle agreement submission
  const handleAgree = async () => {
    if (!hasScrolledToBottom) {
      toast.error('Please read the entire agreement before accepting');
      return;
    }
  
    try {
      setIsSubmitting(true);
      
      // API call to accept terms
      const response = await axiosClient.patch('/v1/vendor/me/mou/true');
      
      if (response.status === 200) {
        // Refresh vendor data after successful MOU signing
        await dispatch(fetchVendorDetails()).unwrap();
        toast.success('MOU signed successfully!');
        // Redirect to pricing page (next step in onboarding)
      } else {
        toast.error('Failed to accept terms');
      }
    } catch (error) {
      console.error("Error accepting terms:", error);
      const errorMessage = error?.response?.data?.detail || 
                          error?.response?.data?.message || 
                          error?.message || 
                          'Failed to accept terms';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/Background.png')" }}
    >
      <div className="flex flex-col lg:flex-row pt-5 pb-5 justify-between px-4 md:px-10">
        <AuthLeftContent />

        <div className="relative flex flex-col w-full lg:w-[60%] bg-white lg:h-[95vh] max-h-[850px] rounded-[24px] shadow-lg overflow-hidden mt-10 lg:mt-20">
        <OnboardingTimeline currentStep={3} />  
          {/* Header */}
          <div className="px-8 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DocumentCheckIcon className="w-6 h-6 text-[#5F22D9]" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Terms & Conditions</h1>
                  <p className="text-sm text-gray-500">Please read and accept to continue</p>
                </div>
              </div>
              
              {/* Progress indicator - percentage only */}
              <div className="hidden sm:flex items-center">
                <span className="text-sm text-[#5F22D9] font-semibold">
                  {Math.round(scrollProgress)}%
                </span>
              </div>
            </div>
          </div>

          {/* Scrollable Content - More padding */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-8 py-6 scroll-smooth"
            style={{ scrollBehavior: 'smooth' }}
          >
            <MOUContent />
          </div>

          {/* Navigation Buttons - Bottom right corner */}
          <div className="absolute right-4 bottom-28 flex flex-col gap-2 z-10">
            <button
              onClick={scrollToTop}
              className="p-2 bg-white shadow-lg rounded-full border border-gray-200 hover:bg-purple-50 hover:border-[#5F22D9] transition-all duration-200 group"
              title="Scroll to top"
            >
              <ChevronUpIcon className="w-5 h-5 text-gray-500 group-hover:text-[#5F22D9]" />
            </button>
            <button
              onClick={scrollToBottom}
              className="p-2 bg-white shadow-lg rounded-full border border-gray-200 hover:bg-purple-50 hover:border-[#5F22D9] transition-all duration-200 group"
              title="Scroll to bottom"
            >
              <ChevronDownIcon className="w-5 h-5 text-gray-500 group-hover:text-[#5F22D9]" />
            </button>
          </div>


          {/* Footer with Agreement Button */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            {/* Scroll hint when not scrolled */}
            {!hasScrolledToBottom && (
              <div className="flex items-center justify-center gap-2 mb-3 text-amber-600 bg-amber-50 py-2 px-4 rounded-lg">
                <ChevronDownIcon className="w-4 h-4 animate-bounce" />
                <span className="text-sm font-medium">Scroll down to read the entire agreement</span>
              </div>
            )}

            {/* Success indicator when scrolled */}
            {hasScrolledToBottom && (
              <div className="flex items-center justify-center gap-2 mb-3 text-green-600 bg-green-50 py-2 px-4 rounded-lg">
                <CheckCircleIcon className="w-4 h-4" />
                <span className="text-sm font-medium">You've read the entire agreement</span>
              </div>
            )}

            <button
              onClick={handleAgree}
              disabled={!hasScrolledToBottom || isSubmitting}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                hasScrolledToBottom && !isSubmitting
                  ? 'bg-[#5F22D9] text-white hover:bg-[#4A1BB8] shadow-lg hover:shadow-xl hover:scale-[1.02]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <BeatLoader color="#ffffff" size={8} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>I Agree to the Terms & Conditions</span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              By clicking "I Agree", you accept the Memorandum of Understanding and all terms stated above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAcceptancePage;