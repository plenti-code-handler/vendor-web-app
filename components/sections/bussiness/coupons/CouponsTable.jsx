"use client";
import React, { useEffect, useState } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axiosClient from "../../../../AxiosClient";
import LoadMoreButton from "../../../buttons/LoadMoreButton";
import TableUpper from "./TableUpper";
import Loader from "../../../loader/loader";
import CouponModal from "./CouponModal";
import { formatTime } from "../../../../utility/FormateTime";
import {
  setCouponToUpdate,
  setOpenDrawer,
} from "../../../../redux/slices/editCouponSlice";
import { fetchActiveCoupons, fetchInactiveCoupons } from "../../../../redux/slices/couponSlice";
import AddCouponDrawer from "../../../../components/drawers/AddCouponDrawer";

const CouponsTable = () => {
  const dispatch = useDispatch();
  const {
    activeCoupons = [],
    inactiveCoupons = [],
    activeLoading,
    inactiveLoading
  } = useSelector((state) => state.coupons);

  const [visibleItems, setVisibleItems] = useState(5);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("active");
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  // Get current coupons based on selected tab
  const currentCoupons = selectedTab === "active" ? activeCoupons : inactiveCoupons;
  const isLoading = selectedTab === "active" ? activeLoading : inactiveLoading;

  useEffect(() => {
    dispatch(fetchActiveCoupons());
    dispatch(fetchInactiveCoupons());
  }, [dispatch]);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setVisibleItems(5);
  };

  const handleEdit = (item) => {
    dispatch(setCouponToUpdate(item));
    dispatch(setOpenDrawer(true));
  };

  const safeCurrentCoupons = Array.isArray(currentCoupons) ? currentCoupons : [];

  const handleLoadMore = () => {
    setVisibleItems((prev) => Math.min(prev + 5, safeCurrentCoupons.length));
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const DeleteCoupon = async () => {
    if (!itemToDelete) return;

    try {
      const response = await axiosClient.delete(
        `/v1/vendor/coupon/delete?coupon_id=${itemToDelete.id}`
      );

      if (response.status === 200) {
        dispatch(fetchActiveCoupons());
        dispatch(fetchInactiveCoupons());
        toast.success("Coupon deleted successfully");
        setShowAlert(false);
        setSelectedItem(null);
      } else {
        toast.error("Failed to delete coupon");
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("An error occurred while deleting the coupon");
    }
  };

  const handleAddCoupon = () => {
    dispatch(setOpenDrawer(true));
  };

  return (
    <div className="w-full">
      <TableUpper
        selectedTab={selectedTab}
        onTabChange={handleTabChange}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Coupon Details
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Valid From
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Valid Till
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {safeCurrentCoupons.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No {selectedTab} coupons
                      </h3>
                      <p className="text-gray-500">
                        Get started by creating your first coupon
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                safeCurrentCoupons.slice(0, visibleItems).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shadow-sm">
                        <img
                          src={item.image_url}
                          alt="Coupon"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-900 mb-1">
                          {item.code}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.name}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {item.discount_type === "PERCENTAGE" ? "%" : "₹"}
                        {item.discount_value}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.discount_type}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      {formatTime(item.valid_from)}
                    </td>

                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      {formatTime(item.valid_until)}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {item.times_used}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.usage_limit ? `of ${item.usage_limit}` : "No limit"}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => openModal(item)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="Edit Coupon"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete(item);
                            setShowAlert(true);
                          }}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Delete Coupon"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {safeCurrentCoupons.length > visibleItems && (
        <div className="px-6 py-4 border-t border-gray-200">
          <LoadMoreButton loadMore={handleLoadMore} isLoading={isLoading} />
        </div>
      )}

      <CouponModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        item={selectedItem}
      />

      <AddCouponDrawer />

      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Coupon
                </h3>
                <p className="text-sm text-gray-500">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this coupon? This will permanently remove it from your system.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAlert(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => DeleteCoupon()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsTable;