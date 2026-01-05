"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronUpIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  DocumentCheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import MOUContent from '../sections/auth/MOUContent';
import BeatLoader from 'react-spinners/BeatLoader';
import axiosClient from '../../AxiosClient';
import { fetchVendorDetails, selectVendorData } from '../../redux/slices/vendorSlice';
import { useDispatch, useSelector } from 'react-redux';

const TermsAcceptanceModal = ({ onClose, isModal = false }) => {
  const dispatch = useDispatch();
  const vendorData = useSelector(selectVendorData);
  const scrollContainerRef = useRef(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  
  // Trigger fade-in animation when component mounts
  useEffect(() => {
    if (isModal) {
      setTimeout(() => setIsVisible(true), 10);
    }
  }, [isModal]);

  // Fetch vendor data if not available
  useEffect(() => {
    if (!vendorData) {
      dispatch(fetchVendorDetails());
    }
  }, [dispatch, vendorData]);

  // Check scroll position
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(Math.min(scrollPercentage, 100));

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

    if (!vendorData) {
      toast.error('Vendor data not loaded. Please try again.');
      return;
    }
  
    try {
      setIsSubmitting(true);
      
      // Prepare JSON data
      const mouData = {
        signed: true,
        user_agent: navigator.userAgent,
        terms_version: '1.0'
      };
      
      // Call API with JSON
      const response = await axiosClient.post('/v1/vendor/me/mou/update', mouData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 200 || response.status === 201) {
        // Refresh vendor data after successful MOU signing
        await dispatch(fetchVendorDetails()).unwrap();
        toast.success('Terms Accepted successfully!');
        if (!isModal) {
          router.push('/');
        } 
        if (onClose) {
          onClose();
        }
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

  const content = (
    <>
      {/* Header */}
      <div className="px-8 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DocumentCheckIcon className="w-6 h-6 text-[#5F22D9]" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Terms & Conditions</h1>
              <p className="text-sm text-gray-500">Please read and accept to continue</p>
            </div>
          </div>
          
          {/* Progress indicator - percentage only */}
          <div className="flex items-center gap-2">
            {isModal && onClose && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="Close"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            )}
            <span className="text-sm text-[#5F22D9] font-semibold">
              {Math.round(scrollProgress)}%
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-8 py-6 scroll-smooth"
        style={{ scrollBehavior: 'smooth' }}
      >
        <MOUContent vendorData={vendorData} />
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
          disabled={!hasScrolledToBottom || isSubmitting || !vendorData}
          className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            hasScrolledToBottom && !isSubmitting && vendorData
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
    </>
  );

  if (isModal) {
    return (
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div 
          className={`relative flex flex-col w-full max-w-4xl bg-white h-[90vh] max-h-[850px] rounded-[24px] shadow-lg overflow-hidden transition-all duration-300 ${
            isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
          }`}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col w-full lg:w-[60%] bg-white lg:h-[80vh] max-h-[850px] rounded-[24px] shadow-lg overflow-hidden mt-10 lg:mt-20">
      {content}
    </div>
  );
};

export default TermsAcceptanceModal;