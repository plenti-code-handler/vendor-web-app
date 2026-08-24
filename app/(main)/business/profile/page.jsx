import React from "react";
import ProfileCard from "../../../../components/sections/bussiness/profile/ProfileCard";
import Transactions from "../../../../components/sections/bussiness/profile/Transactions";
import { RevenueProvider } from "../../../../contexts/RevenueContext";

const Page = () => {
  return (
    <div className="w-[90%] mx-auto animate-slide-in-left">
      <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
        <div className="w-full min-w-0 lg:flex-[1.6]">
          <ProfileCard />
        </div>
        <div className="w-full min-w-0 lg:flex-1">
          <RevenueProvider>
            <Transactions />
          </RevenueProvider>
        </div>
      </div>
    </div>
  );
};

export default Page;
