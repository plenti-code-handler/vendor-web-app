// vendor-web-app/components/sections/bussiness/coupons/TableUpper.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { setOpenDrawer } from "../../../../redux/slices/addCouponSlice";
import { PlusIcon } from "@heroicons/react/24/outline";

const TableUpper = ({ selectedTab, onTabChange }) => {
  const dispatch = useDispatch();

  const handleAddCoupon = () => {
    dispatch(setOpenDrawer(true));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left side - Tab Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onTabChange("active")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedTab === "active"
                ? "bg-green-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Active Coupons
          </button>
          <button
            onClick={() => onTabChange("inactive")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedTab === "inactive"
                ? "bg-red-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Inactive Coupons
          </button>
        </div>

        {/* Right side - Add New Coupon Button */}
        <button
          onClick={handleAddCoupon}
          className="inline-flex items-center px-4 py-2 bg-blueBgDark text-white rounded-lg hover:bg-blueBgDarkHover2 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New Coupon
        </button>
      </div>
    </div>
  );
};

export default TableUpper;