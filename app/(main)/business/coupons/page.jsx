// Create this file: vendor-web-app/app/(main)/business/coupons/page.jsx
"use client";
import React from "react";
import CouponsTable from "../../../../components/sections/bussiness/coupons/CouponsTable";
import CouponEditModal from "../../../../components/sections/bussiness/coupons/CouponEditModal";
import { useSelector } from "react-redux";
import AddCouponDrawer from "../../../../components/drawers/AddCouponDrawer";

const CouponsPage = () => {
  const openDrawer = useSelector((state) => state.editCoupon);

  return (
    <div className="min-h-screen bg-gray-50 animate-slide-in-left">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="mb-4 sm:mb-6">
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Manage your coupons and promotional offers
          </p>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow sm:rounded-2xl">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[720px]">
              <CouponsTable />
            </div>
          </div>
        </div>

        {openDrawer && <CouponEditModal />}
        <AddCouponDrawer />
      </div>
    </div>
  );
};

export default CouponsPage;