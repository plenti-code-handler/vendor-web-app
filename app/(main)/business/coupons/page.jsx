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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-600 mt-2">
            Manage your coupons and promotional offers
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <CouponsTable />
        </div>
        
        {openDrawer && <CouponEditModal />}
        <AddCouponDrawer />
      </div>
    </div>
  );
};

export default CouponsPage;