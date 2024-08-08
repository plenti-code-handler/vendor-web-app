import React from "react";
import RenderStats from "../../../components/sections/admin/dashboard/RenderStats";
import RecentOrders from "../../../components/sections/admin/dashboard/RecentOrders";

const Page = () => {
  return (
    <div className="flex flex-col w-[100%]">
      <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 lg:w-[100%]">
        <RenderStats />
      </div>
      <RecentOrders />
    </div>
  );
};

export default Page;
