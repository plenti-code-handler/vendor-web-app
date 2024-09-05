import React from "react";
import ProfileCard from "../../../../components/sections/bussiness/profile/ProfileCard";
import Transactions from "../../../../components/sections/bussiness/profile/Transactions";
import { RevenueProvider } from "../../../../contexts/RevenueContext";

const Page = () => {
  return (
    <div className="flex flex-col md:flex-row gap-10">
      <ProfileCard />
      <RevenueProvider>
        <Transactions />
      </RevenueProvider>
    </div>
  );
};

export default Page;
