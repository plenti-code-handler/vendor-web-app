"use client";
import { useEffect, useRef, useState } from "react";
import axiosClient from "../../../../AxiosClient";
import { toast } from "sonner";
import OrdersFilter from "../../../dropdowns/OrdersFilter";
import { formatTimestamp, formatTime, formatDateTime } from "../../../../utility/FormateTime";
import { EyeIcon, XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { ShieldCheckIcon } from "@heroicons/react/20/solid";
import DietIcon from "../../../common/DietIcon";
import BagSizeTag from "../../../common/BagSizeTag";
import OrderDetailsModal from "../../../modals/OrderDetailsModal";
import { ITEM_TYPE_DISPLAY_NAMES } from "../../../../constants/itemTypes";
import { messaging, onMessage } from "../../../../lib/firebase";
import playNotificationSound from "../../../../utils/notificationSound";


const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState(true); // This will be true, false, or ""
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [verifying, setVerifying] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loadingOrderId, setLoadingOrderId] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreOrders, setHasMoreOrders] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  
  const ITEMS_PER_PAGE = 10;

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 4) inputRefs.current[index + 1]?.focus();
  };

  const handleVerifyCode = async () => {
    const code = otp.join("");
    if (code.length !== 5) {
      toast.error("Please enter a 5-digit code");
      return;
    }
    setVerifying(true);
    try {
      const response = await axiosClient.patch(
        `/v1/vendor/order/pickup/${selectedOrderId}?order_code=${code}`
      );
      if (response.status === 200) {
        toast.success("Order code verified successfully");
        setVerifyModalOpen(false);
        // Refresh orders after successful verification
        fetchRecentOrders(true);
      }
    } catch (error) {
      toast.error("Failed to verify order code");
    } finally {
      setVerifying(false);
    }
  };

  const fetchRecentOrders = async (reset = false) => {
    if (reset) {
      setCurrentPage(0);
      setOrders([]);
      setHasMoreOrders(true);
    }

    const skip = reset ? 0 : currentPage * ITEMS_PER_PAGE;
    setLoading(reset);
    setLoadingMore(!reset);

    try {
      // Build the API URL with the active parameter
      let apiUrl = `/v1/vendor/order/get?skip=${skip}&limit=${ITEMS_PER_PAGE}`;
      
      // Add active parameter based on filter
      if (filter === true) {
        apiUrl += "&active=true";
      } else if (filter === false) {
        apiUrl += "&active=false";
      }
      // If filter is "" (All Orders), don't add active parameter

      const response = await axiosClient.get(apiUrl);
      if (response.status === 200) {
        const newOrders = response.data || [];
        
        if (reset) {
          setOrders(newOrders);
        } else {
          setOrders(prevOrders => [...prevOrders, ...newOrders]);
        }
        
        // Check if there are more orders to load
        setHasMoreOrders(newOrders.length === ITEMS_PER_PAGE);
        
        if (!reset) {
          setCurrentPage(prev => prev + 1);
        }
      }
    } catch (error) {
      // if error code is not 403
      if (error.response.status !== 403) {
        toast.error("Failed to fetch orders");
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchRecentOrders(true);
  }, [filter]);

  // Listen for push notifications and refresh orders
  useEffect(() => {
    if (!messaging) return;
    
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Notification received:', payload);
      playNotificationSound('order', 0.7);
      
      // Show toast notification
      toast.success(payload.notification?.title || 'New Notification', {
        description: payload.notification?.body || 'You have a new notification',
        duration: 5000,
      });
      
      // Automatically refresh orders when notification is received
      fetchRecentOrders(true);
    });

    return () => unsubscribe();
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && hasMoreOrders) {
      fetchRecentOrders(false);
    }
  };

  const openModal = async (orderId) => {
    setLoadingOrderId(orderId);
    try {
      const response = await axiosClient.get(
        `/v1/vendor/order/${orderId}/items`
      );
      if (response.status === 200) {
        setSelectedItem({ id: orderId, items: response.data });
        console.log(response.data, "response.data")
        setModalOpen(true);
      } else {
        toast.error("Failed to fetch order details");
      }
    } catch (error) {
      toast.error("Error fetching order items");
    } finally {
      setLoadingOrderId(null);
    }
  };

  // --- UI ---
  return (
    <div className="mt-4 w-full border border-gray-200 rounded-2xl bg-white shadow-sm p-6 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchRecentOrders(true)}
            disabled={loading}
            className={`p-2 rounded-lg transition-all duration-200 ${
              loading
                ? "bg-purple-50 cursor-not-allowed"
                : "bg-purple-50 hover:bg-purple-100 hover:shadow-sm active:scale-95"
            } border border-purple-200`}
            title="Refresh orders"
          >
            <ArrowPathIcon
              className={`h-5 w-5 text-purple-600 ${loading ? "animate-spin" : ""}`}
            />
          </button>
          <OrdersFilter selectedFilter={filter} onFilterChange={setFilter} />
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[800px] table-fixed">
          <thead>
            <tr className="border-b text-xs font-semibold text-gray-500 uppercase">
              <th className="pb-2 px-2 pt-4 text-center w-[12%]">User Name</th>
              <th className="pb-2 px-2 pt-4 text-center w-[10%]">Phone</th>
              <th className="pb-2 px-2 pt-4 text-center w-[8%]">Amount</th>
              <th className="pb-2 px-2 pt-4 text-center w-[22%]">Items</th>
              <th className="pb-2 px-2 pt-4 text-center w-[12%]">Allergens</th>
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
              orders.map((order, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 transition">
                  <td className="text-center px-2 text-sm py-3">
                    <div className="truncate" title={order.user_name || "Not provided"}>
                      {order.user_name ?? <span className="text-gray-400">Not provided</span>}
                    </div>
                  </td>
                  <td className="text-center px-2 text-sm">
                    <div className="truncate" title={order.user_phone_number || "Not provided"}>
                      {order.user_phone_number
                        ? order.user_phone_number.slice(0, -3) + "***"
                        : <span className="text-gray-400">Not provided</span>}
                    </div>
                  </td>
                  <td className="text-center px-2 text-sm font-semibold text-blue-700">
                    ₹ {order.transaction_amount}
                  </td>
                  <td className="text-center px-1 py-2">
                    {order.checkout_items && order.checkout_items.length > 0 ? (
                      <div className="flex flex-col items-center space-y-1">
                        {order.checkout_items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-[10px] leading-tight whitespace-nowrap">
                            <DietIcon diet={item.diet} size="xs" />
                            <span className="flex items-center gap-1">
                              <span className="font-medium">{item.quantity}X</span>
                              <span className="text-gray-600">{ITEM_TYPE_DISPLAY_NAMES[item.item_type] || item.item_type}</span>
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
                    {order.allergens && order.allergens.length > 0 ? (
                      <div className="flex flex-wrap gap-1 justify-center">
                        {order.allergens.map((allergen, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium"
                          >
                            {allergen.charAt(0).toUpperCase() + allergen.slice(1).toLowerCase()}
                          </span>
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
                    {(() => {
                      const rawStatus = order.current_status;
                      if (!rawStatus) {
                        return (
                          <span className="inline-block px-2 py-1 rounded bg-gray-400 text-white text-xs font-semibold">
                            Not Available
                          </span>
                        );
                      }
                      const status = rawStatus.replace("order.", "").toUpperCase();
                      const getStatusColor = (status) => {
                        switch (status) {
                          case "CREATED": return "bg-[#7e45ee]";
                          case "WAITING_FOR_PICKUP": return "bg-indigo-500";
                          case "READY_FOR_PICKUP": return "bg-yellow-500";
                          case "PICKED_UP": return "bg-green-500";
                          case "CANCELLED": return "bg-red-500";
                          case "NOT_PICKED_UP": return "bg-orange-500";
                          default: return "bg-blue-500";
                        }
                      };
                      const formattedText = status
                        .toLowerCase()
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase());
                      return (
                        <span
                          className={`inline-block px-2 py-1 rounded text-white text-xs font-semibold ${getStatusColor(status)}`}
                        >
                          {formattedText}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="text-center px-2 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openModal(order.order_id)}
                        className="p-2 rounded hover:bg-blue-50 transition"
                        title="View"
                        disabled={loadingOrderId === order.order_id}
                      >
                        {loadingOrderId === order.order_id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                        ) : (
                          <EyeIcon className="h-5 w-5 text-blue-600" />
                        )}
                      </button>
                      {order.current_status === "READY_FOR_PICKUP" && (
                        <button
                          onClick={() => {
                            setSelectedOrderId(order.order_id);
                            setVerifyModalOpen(true);
                          }}
                          className="p-2 rounded hover:bg-green-50 transition"
                          title="Verify Pickup"
                        >
                          <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
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
                <div className="w-3 h-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </div>
            ) : (
              "Load More Orders"
            )}
          </button>
        </div>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        orderDetails={selectedItem}
      />

      {/* OTP Verify Modal */}
      {verifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Enter Order Code</h2>
              <button onClick={() => setVerifyModalOpen(false)}>
                x
              </button>
            </div>
            {/* OTP Inputs */}
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
                  className="w-12 h-12 border border-gray-300 text-center text-xl rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                />
              ))}
            </div>
            {/* Footer */}
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
    </div>
  );
};

export default RecentOrders;