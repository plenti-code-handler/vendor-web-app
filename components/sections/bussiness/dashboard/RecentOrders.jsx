"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import axiosClient from "../../../../AxiosClient";
import { toast } from "sonner";
import OrdersFilter from "../../../dropdowns/OrdersFilter";
import { formatTime, formatDateTime } from "../../../../utility/FormatTime";
import { ArrowPathIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";
import DietIcon from "../../../common/DietIcon";
import BagSizeTag from "../../../common/BagSizeTag";
import OrderActionModal from "../../../modals/OrderActionModal";
import { ITEM_TYPE_DISPLAY_NAMES } from "../../../../constants/itemTypes";
import OrderStatusBadge from "../../../common/OrderStatusBadge";
import {
  preloadSound,
  initializeAudio,
} from "../../../../utils/notificationSound";
import ToggleOnlineOffline from "../../../sections/bussiness/profile/ToggleOnlineOffline";
import SuccessConfettiOverlay from "../../../common/SuccessConfettiOverlay";
import { VENDOR_ORDERS_REFRESH_EVENT } from "../../../../utility/vendorOrderEvents";

// Constants
const ITEMS_PER_PAGE = 10;

const RecentOrders = () => {
  // State management - grouped by concern
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreOrders, setHasMoreOrders] = useState(true);

  // Order action modal
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [successConfetti, setSuccessConfetti] = useState(false);

  // Refs
  const filterRef = useRef(filter);

  // Sync filter ref
  useEffect(() => {
    filterRef.current = filter;
  }, [filter]);

  // Initialize audio
  useEffect(() => {
    preloadSound('order');

    const unlockAudio = () => initializeAudio();

    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });

    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  // Fetch orders function
  const fetchRecentOrders = useCallback(async (reset = false, pageNum = 0, currentFilter = null) => {
    if (reset) {
      setCurrentPage(0);
      setOrders([]);
      setHasMoreOrders(true);
    }

    const skip = reset ? 0 : pageNum * ITEMS_PER_PAGE;
    const activeFilter = currentFilter ?? filterRef.current;

    setLoading(reset);
    setLoadingMore(!reset);

    try {
      let apiUrl = `/v1/vendor/order/get?skip=${skip}&limit=${ITEMS_PER_PAGE}`;

      if (activeFilter === true) {
        apiUrl += "&active=true";
      } else if (activeFilter === false) {
        apiUrl += "&active=false";
      }

      const response = await axiosClient.get(apiUrl);

      if (response.status === 200) {
        const newOrders = response.data || [];

        setOrders(prev => reset ? newOrders : [...prev, ...newOrders]);
        setCurrentPage(reset ? 1 : pageNum + 1);
        setHasMoreOrders(newOrders.length === ITEMS_PER_PAGE);
      }
    } catch (error) {
      if (error.response?.status !== 403) {
        toast.error("Failed to fetch orders");
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Fetch orders when filter changes
  useEffect(() => {
    fetchRecentOrders(true, 0, filter);
  }, [filter, fetchRecentOrders]);

  // FCM / service worker: reload list when a new order notification fires (see NotificationSoundHandler)
  useEffect(() => {
    const onRemoteOrdersRefresh = () => {
      fetchRecentOrders(true, 0, filterRef.current);
    };
    window.addEventListener(VENDOR_ORDERS_REFRESH_EVENT, onRemoteOrdersRefresh);
    return () =>
      window.removeEventListener(VENDOR_ORDERS_REFRESH_EVENT, onRemoteOrdersRefresh);
  }, [fetchRecentOrders]);

  // Handlers
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMoreOrders) {
      fetchRecentOrders(false, currentPage, filter);
    }
  }, [loadingMore, hasMoreOrders, currentPage, filter, fetchRecentOrders]);

  const handleRefresh = useCallback(() => {
    toast.info("Refreshing orders...");
    fetchRecentOrders(true, 0, filter);
  }, [filter, fetchRecentOrders]);

  const closeOrderModal = useCallback(() => {
    setOrderModalOpen(false);
    setSelectedOrder(null);
    setOrderDetails(null);
    setLoadingOrderDetails(false);
  }, []);

  const handleOpenOrder = useCallback(async (order) => {
    const orderId = order.order_id;
    setSelectedOrder(order);
    setOrderDetails(null);
    setOrderModalOpen(true);
    setLoadingOrderDetails(true);

    try {
      const response = await axiosClient.get(`/v1/vendor/order/${orderId}/items`);
      if (response.status === 200) {
        

        // Map through checkout_items and inject the new fields into each item
        const updatedItems = order.checkout_items.map(item => ({
          ...item,
          window_start_time: response.data.find(item => item.item_id === item.item_id).window_start_time,
          window_end_time: response.data.find(item => item.item_id === item.item_id).window_end_time,
          best_before_time: response.data.find(item => item.item_id === item.item_id).best_before_time
        }));
        console.log(updatedItems, "updated items checking");

        // Set the updated state
        setOrderDetails({ 
          items: updatedItems, 
          orderData: order 
        });
      } else {
        toast.error("Failed to fetch order details");
      }
    } catch {
      toast.error("Error fetching order items");
    } finally {
      setLoadingOrderDetails(false);
    }
  }, []);

  const handleVerifySuccess = useCallback(() => {
    setSuccessConfetti(true);
    setTimeout(() => {
      handleRefresh();
    }, 1000);
  }, [handleRefresh]);

  const renderTableRow = useCallback((order) => (
    <tr
      key={order.order_id}
      onClick={() => handleOpenOrder(order)}
      className="border-b hover:bg-gray-50 transition animate-fade-down cursor-pointer"
    >
      <td className="text-center px-2 text-sm py-3">
        <div className="truncate" title={order.user_name || "Not provided"}>
          {order.user_name || <span className="text-gray-400">Not provided</span>}
        </div>
      </td>

      <td className="text-center px-2 text-sm">
        <div className="truncate" title={order.user_phone_number || "Not provided"}>
          {order.user_phone_number
            ? `${order.user_phone_number.slice(0, -3)}***`
            : <span className="text-gray-400">Not provided</span>}
        </div>
      </td>

      <td className="text-center px-4 text-sm font-semibold text-blue-700 ">
        ₹{order.vendor_cut}
      </td>

      <td className="text-center px-1 py-2">
        {order.checkout_items?.length > 0 ? (
          <div className="flex flex-col items-center space-y-1">
            {order.checkout_items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1 text-[10px] leading-tight whitespace-nowrap mx-2">
                <DietIcon diet={item.diet} size="xs" />
                <span className="flex items-center gap-1">
                  <span className="text-gray-600">
                    {ITEM_TYPE_DISPLAY_NAMES[item.item_type] || item.item_type}
                  </span>
                  <BagSizeTag
                    bagSize={item.bag_size}
                    showIcon={false}
                    showWorth={true}
                    itemType={item.item_type}
                    pricingId={item.pricing_id}
                    quantity={item.quantity}
                  />
                </span>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-gray-400 text-[10px]">No items</span>
        )}
      </td>

      <td className="text-center px-2 text-xs py-2">
        {order.checkout_items?.length > 0 ? (
          <div className="flex flex-col gap-1.5 items-center">
            {order.checkout_items
              .filter(item => item.description)
              .map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDescription(item.description);
                  }}
                  className="w-full px-4 py-3 rounded-full bg-gray-100 text-gray-700 text-xs hover:bg-gray-200 transition-colors cursor-pointer truncate"
                  title={item.description}
                >
                  {item.description}
                </button>
              ))}
          </div>
        ) : (
          <span className="text-gray-400 text-xs">None</span>
        )}
      </td>

      <td className="text-center px-2 text-xs text-gray-500">
        <div className="truncate" title={formatTime(order.created_at)}>
          {formatDateTime(order.created_at)}
        </div>
      </td>

      <td className="text-center px-2 text-xs">
        <OrderStatusBadge status={order.current_status} />
      </td>

      <td className="text-center px-2 py-2">
        <div className="flex items-center justify-center pointer-events-none">
          {loadingOrderDetails && selectedOrder?.order_id === order.order_id ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
          ) : (
            <ArrowUpRightIcon className="h-5 w-5 text-blue-600" />
          )}
        </div>
      </td>
    </tr>
  ), [loadingOrderDetails, selectedOrder?.order_id, handleOpenOrder]);

  // Main render
  return (
    <div className="mt-4 w-full border border-gray-200 rounded-2xl bg-white shadow-sm p-6 sm:px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`p-2 rounded-lg transition-all duration-200 border border-purple-200 ${loading
                ? "bg-purple-50 cursor-not-allowed"
                : "bg-purple-50 hover:bg-purple-100 hover:shadow-sm active:scale-95"
              }`}
            title="Refresh orders"
            aria-label="Refresh orders"
          >
            <ArrowPathIcon className={`h-5 w-5 text-purple-600 ${loading ? "animate-spin" : ""}`} />
          </button>
          <div className="flex w-full items-center justify-end gap-3 sm:w-auto sm:justify-end">
            <ToggleOnlineOffline />
            <OrdersFilter selectedFilter={filter} onFilterChange={setFilter} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[800px] table-fixed animate-fade-down">
          <thead>
            <tr className="border-b text-xs font-semibold text-gray-500 uppercase">
              <th className="pb-2 px-2 pt-4 text-center w-[12%]">User Name</th>
              <th className="pb-2 px-2 pt-4 text-center w-[12%]">Phone</th>
              <th className="pb-2 px-4 pt-4 text-center w-[8%]">You Get</th>
              <th className="pb-2 px-2 pt-4 text-center w-[22%]">Items</th>
              <th className="pb-2 px-2 pt-4 text-center w-[16%]">Descriptions</th>
              <th className="pb-2 px-2 pt-4 text-center w-[12%]">Created At</th>
              <th className="pb-2 px-2 pt-4 text-center w-[12%]">Status</th>
              <th className="pb-2 text-center pt-4 w-[12%]">View</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map(renderTableRow)
            ) : (
              <tr className="animate-fade-down">
                <td colSpan="8" className="text-center py-8 text-gray-400">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Load More Button */}
      {orders.length > 0 && hasMoreOrders && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className={`px-4 py-2 rounded-md text-sm font-normal transition-colors duration-200 ${loadingMore
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
          >
            {loadingMore ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                Loading...
              </div>
            ) : (
              "Load More Orders"
            )}
          </button>
        </div>
      )}

      <OrderActionModal
        open={orderModalOpen}
        onClose={closeOrderModal}
        order={selectedOrder}
        orderDetails={orderDetails}
        loadingDetails={loadingOrderDetails}
        onVerifySuccess={handleVerifySuccess}
      />

      {/* Description Modal */}
      {selectedDescription && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={() => setSelectedDescription(null)}
        >
          <div
            className="animate-popout inline-block px-4 py-3 rounded-full bg-gray-100 text-gray-700 text-xs relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedDescription(null)}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800 flex items-center justify-center text-xs font-semibold transition-colors shadow-sm"
              aria-label="Close"
            >
              ×
            </button>
            <span className="pr-4">{selectedDescription}</span>
          </div>
        </div>
      )}

      <SuccessConfettiOverlay
        show={successConfetti}
        onComplete={() => setSuccessConfetti(false)}
      />
    </div>
  );
};

export default RecentOrders;