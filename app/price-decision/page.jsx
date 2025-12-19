"use client";
import PricingForm from "../../components/sections/auth/PricingForm";

export default function PriceDecisionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl mx-auto">
        <PricingForm showBackButton={true} />
      </div>
    </div>
  );
}