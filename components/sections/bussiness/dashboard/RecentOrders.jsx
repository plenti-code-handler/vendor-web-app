"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import axiosClient from "../../../../AxiosClient";
import { toast } from "sonner";
import OrdersFilter from "../../../dropdowns/OrdersFilter";
import { formatTime, formatDateTime } from "../../../../utility/FormateTime";
import { EyeIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { ShieldCheckIcon } from "@heroicons/react/20/solid";
import DietIcon from "../../../common/DietIcon";
import BagSizeTag from "../../../common/BagSizeTag";
import OrderDetailsModal from "../../../modals/OrderDetailsModal";
import { ITEM_TYPE_DISPLAY_NAMES } from "../../../../constants/itemTypes";
import { 
  preloadSound, 
  initializeAudio, 
} from "../../../../utils/notificationSound";
import ToggleOnlineOffline from "../../../sections/bussiness/profile/ToggleOnlineOffline";

// Constants
const ITEMS_PER_PAGE = 10;
const OTP_LENGTH = 5;

// Status configuration
const ORDER_STATUS_CONFIG = {
  CREATED: { color: "bg-[#7e45ee]", label: "Created" },
  WAITING_FOR_PICKUP: { color: "bg-indigo-500", label: "Waiting For Pickup" },
  READY_FOR_PICKUP: { color: "bg-yellow-500", label: "Ready For Pickup" },
  PICKED_UP: { color: "bg-green-500", label: "Picked Up" },
  CANCELLED: { color: "bg-red-500", label: "Cancelled" },
  NOT_PICKED_UP: { color: "bg-orange-500", label: "Not Picked Up" },
};

const RecentOrders = () => {
  // State management - grouped by concern
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreOrders, setHasMoreOrders] = useState(true);
  
  // Modal states
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loadingOrderId, setLoadingOrderId] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState(null);
  
  // OTP states
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [verifying, setVerifying] = useState(false);
  
  // Refs
  const inputRefs = useRef([]);
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

  const handleViewOrder = useCallback(async (order) => {
    const orderId = order.order_id;
    setLoadingOrderId(orderId);
    try {
      const response = await axiosClient.get(`/v1/vendor/order/${orderId}/items`);
      if (response.status === 200) {
        setSelectedItem({ id: orderId, items: response.data, orderData: order });
        setModalOpen(true);
      } else {
        toast.error("Failed to fetch order details");
      }
    } catch (error) {
      toast.error("Error fetching order items");
    } finally {
      setLoadingOrderId(null);
    }
  }, []);

  const handleVerifyPickup = useCallback((orderId) => {
    setSelectedOrderId(orderId);
    setVerifyModalOpen(true);
  }, []);

  const handleOtpChange = useCallback((value, index) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [otp]);

  const handlePaste = useCallback((e, currentIndex) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').replace(/\D/g, '');
    
    if (pastedText.length >= OTP_LENGTH) {
      const newOtp = pastedText.slice(0, OTP_LENGTH).split('');
      setOtp(newOtp);
      inputRefs.current[OTP_LENGTH - 1]?.focus();
    } else {
      const newOtp = [...otp];
      for (let i = 0; i < pastedText.length && (currentIndex + i) < OTP_LENGTH; i++) {
        newOtp[currentIndex + i] = pastedText[i];
      }
      setOtp(newOtp);
      
      const nextIndex = currentIndex + pastedText.length;
      if (nextIndex < OTP_LENGTH) {
        inputRefs.current[nextIndex]?.focus();
      }
    }
  }, [otp]);

  const handleVerifyCode = useCallback(async () => {
    const code = otp.join("");
    
    if (code.length !== OTP_LENGTH) {
      toast.error(`Please enter a ${OTP_LENGTH}-digit code`);
      return;
    }
    
    setVerifying(true);
    
    try {
      const response = await axiosClient.patch(
        `/v1/vendor/order/pickup/${selectedOrderId}?order_code=${code}`
      );
      
      if (response.status === 200) {
        toast.success("Order code verified successfully");
        closeVerifyModal();
        fetchRecentOrders(true, 0, filterRef.current);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify order code");
    } finally {
      setVerifying(false);
    }
  }, [otp, selectedOrderId, fetchRecentOrders]);

  const closeVerifyModal = useCallback(() => {
    setVerifyModalOpen(false);
    setOtp(Array(OTP_LENGTH).fill(""));
    setVerifying(false);
    setSelectedOrderId(null);
  }, []);

  // Render helpers
  const renderOrderStatus = useCallback((rawStatus) => {
    if (!rawStatus) {
      return (
        <span className="inline-block px-2 py-1 rounded bg-gray-400 text-white text-xs font-semibold">
          Not Available
        </span>
      );
    }
    
    const status = rawStatus.replace("order.", "").toUpperCase();
    const config = ORDER_STATUS_CONFIG[status] || { 
      color: "bg-blue-500", 
      label: status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    };
    
    return (
      <span className={`inline-block px-2 py-1 rounded text-white text-xs font-semibold ${config.color}`}>
        {config.label}
      </span>
    );
  }, []);

  const renderTableRow = useCallback((order) => (
    <tr key={order.order_id} className="border-b hover:bg-gray-50 transition animate-fade-down">
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
                  <span className="font-medium">{item.quantity}X</span>
                  <span className="text-gray-600">
                    {ITEM_TYPE_DISPLAY_NAMES[item.item_type] || item.item_type}
                  </span>
                  <BagSizeTag 
                    bagSize={item.bag_size} 
                    showIcon={false}
                    showWorth={true}
                    itemType={item.item_type}
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
                  onClick={() => setSelectedDescription(item.description)}
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
        {renderOrderStatus(order.current_status)}
      </td>
      
      <td className="text-center px-2 py-2">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleViewOrder(order)}
            className="p-2 rounded hover:bg-blue-50 transition"
            title="View"
            disabled={loadingOrderId === order.order_id}
          >
            {loadingOrderId === order.order_id ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
            ) : (
              <EyeIcon className="h-5 w-5 text-blue-600" />
            )}
          </button>
          
          {order.current_status === "READY_FOR_PICKUP" && (
            <button
              onClick={() => handleVerifyPickup(order.order_id)}
              className="px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 text-xs font-medium transition-all duration-200 hover:border-green-300"
              title="Verify Pickup"
            >
              Verify OTP
            </button>
          )}
        </div>
      </td>
    </tr>
  ), [loadingOrderId, handleViewOrder, handleVerifyPickup, renderOrderStatus]);

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
            className={`p-2 rounded-lg transition-all duration-200 border border-purple-200 ${
              loading
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
              <th className="pb-2 text-center pt-4 w-[12%]">Action</th>
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
            className={`px-4 py-2 rounded-md text-sm font-normal transition-colors duration-200 ${
              loadingMore
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

      {/* Modals */}
      <OrderDetailsModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        orderDetails={selectedItem}
      />

      {verifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Enter Order Code</h2>
              <button 
                onClick={closeVerifyModal}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            
            <div className="flex justify-center gap-3 py-8">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  ref={(el) => (inputRefs.current[i] = el)}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onPaste={(e) => handlePaste(e, i)}
                  className="w-12 h-12 border border-gray-300 text-center text-xl rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  aria-label={`Digit ${i + 1}`}
                />
              ))}
            </div>
            
            <div className="flex justify-end px-6 py-4 border-t bg-gray-50">
              <button
                onClick={handleVerifyCode}
                disabled={verifying}
                className={`px-6 py-2 rounded-lg font-medium text-white transition ${
                  verifying
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {verifying ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default RecentOrders;