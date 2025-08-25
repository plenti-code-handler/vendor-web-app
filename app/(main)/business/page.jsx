import React from "react";
import RenderStats from "../../../components/sections/bussiness/dashboard/RenderStats";
import RecentOrders from "../../../components/sections/bussiness/dashboard/RecentOrders";

const Page = () => {


  return (
    <div className="flex flex-col ">
      <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
        <RenderStats />
      </div>
      <RecentOrders />
    </div>
  );
};

export default Page;
