"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import AuthLeftContent from '../../../components/layouts/AuthLeftContent';
import OnboardingTimeline from '../../../components/common/OnboardingTimeLine';
import PricingForm from '../../../components/sections/auth/PricingForm';
import { useDispatch } from 'react-redux';
import { fetchVendorDetails } from '../../../redux/slices/vendorSlice';
import { fetchCatalogue, fetchCatalogueRequest } from '../../../redux/slices/catalogueSlice';

function PricingPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSuccess = async () => {
    // Refresh vendor data and catalogue after successful submission
    await Promise.allSettled([
      dispatch(fetchVendorDetails()),
      dispatch(fetchCatalogue()),
      dispatch(fetchCatalogueRequest()),
    ]);
    // OnboardLayout will handle routing based on updated state
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/Background.png')" }}
    >
      <div className="flex flex-col lg:flex-row pt-5 pb-5 justify-between px-4 md:px-10">
        <AuthLeftContent />

        <div className="flex flex-col w-full lg:w-[60%] bg-white lg:h-[95vh] max-h-[850px] rounded-[24px] shadow-lg overflow-hidden mt-10 lg:mt-20">
          <OnboardingTimeline currentStep={4} />
          
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <PricingForm onSuccess={handleSuccess} showBackButton={true} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;