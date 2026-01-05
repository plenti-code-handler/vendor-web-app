"use client";
import React from 'react';
import AuthLeftContent from '../../components/layouts/AuthLeftContent';
import TermsAcceptanceModal from '../../components/modals/TermsAcceptanceModal';
import OnboardingTimeline from '../../components/common/OnboardingTimeLine';

const TermsAcceptancePage = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/Background.png')" }}
    >
      <div className="flex flex-col lg:flex-row pt-5 pb-5 justify-between px-4 md:px-10">
        <AuthLeftContent />
        <TermsAcceptanceModal isModal={false} />
      </div>
    </div>
  );
};

export default TermsAcceptancePage;