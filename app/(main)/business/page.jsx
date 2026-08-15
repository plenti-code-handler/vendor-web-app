import React from "react";
import RenderStats from "../../../components/sections/bussiness/dashboard/RenderStats";
import RecentOrders from "../../../components/sections/bussiness/dashboard/RecentOrders";

const Page = () => {
  return (
    <div className="flex flex-col p-5 animate-slide-in-left">
      <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
        <span className="mt-0.5 text-lg leading-none" aria-hidden="true">
          ⚠
        </span>
        <div>
          <p className="text-sm font-semibold">Payment gateway issue</p>
          <p className="text-sm">
            We&apos;re currently facing a payment gateway issue, so listing is
            paused. We&apos;ll resume listing in a while. Thank you for your
            patience.
          </p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
        <RenderStats />
      </div>
      <RecentOrders />
    </div>
  );
};

export default Page;
