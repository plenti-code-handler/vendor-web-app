"use client";
import { useEffect, useRef, useState } from "react";
import axiosClient from "../../../../AxiosClient";
import { toast } from "sonner";
import OrdersFilter from "../../../dropdowns/OrdersFilter";
import { formatTimestamp, formatTime, formatDateTime } from "../../../../utility/FormateTime";
import { EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ShieldCheckIcon } from "@heroicons/react/20/solid";

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
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchRecentOrders(true);
  }, [filter]);

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
        <OrdersFilter selectedFilter={filter} onFilterChange={setFilter} />
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[800px] table-fixed">
          <thead>
            <tr className="border-b text-xs font-semibold text-gray-500 uppercase">
              <th className="pb-2 px-2 pt-4 text-center w-1/7">User Name</th>
              <th className="pb-2 px-2 pt-4 text-center w-1/7">Phone</th>
              <th className="pb-2 px-2 pt-4 text-center w-1/7">Amount</th>
              <th className="pb-2 px-2 pt-4 text-center w-1/7">Allergens</th>
              <th className="pb-2 px-2 pt-4 text-center w-1/7">Created At</th>
              <th className="pb-2 px-2 pt-4 text-center w-1/7">Status</th>
              <th className="pb-2 text-center pt-4 w-1/7">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-400">
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
                <td colSpan="7" className="text-center py-8 text-gray-400">
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
      {modalOpen && selectedItem?.items?.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
              <button onClick={() => setModalOpen(false)}>
                <XMarkIcon className="h-6 w-6 text-gray-400 hover:text-gray-900" />
              </button>
            </div>
            {/* Scrollable Items */}
            <div className="overflow-y-auto max-h-[70vh] px-6 py-4 space-y-6">
              {selectedItem.items.map((item, index) => (
                <div key={item.item_id || index} className="rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col md:flex-row gap-4 bg-gray-50">
                  <img
                    src={item.image_url}
                    alt="Item"
                    className="h-32 w-32 object-cover rounded-lg border"
                  />
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Type:</span>{" "}
                      <span className="text-gray-900">{item.item_type.replace(/_/g, " ")}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Description:</span>{" "}
                      <span className="text-gray-900">{item.description}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Tags:</span>{" "}
                      <span className="text-gray-900">
                        {item.tags?.map(
                          (tag) =>
                            tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()
                        ).join(", ") || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Diet:</span>{" "}
                      <span className="text-gray-900">{item.diet}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Quantity:</span>{" "}
                      <span className="text-gray-900">{item.quantity}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Price:</span>{" "}
                      <span className="text-gray-900">₹{item.price}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Bag Size:</span>{" "}
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                        item.bag_size === 'SMALL' 
                          ? 'bg-blue-100 text-blue-700' 
                          : item.bag_size === 'MEDIUM' 
                          ? 'bg-yellow-100 text-yellow-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {item.bag_size === 'SMALL' && '👜'}
                        {item.bag_size === 'MEDIUM' && '🛍️'}
                        {item.bag_size === 'LARGE' && '🛒'}
                        {' '}{item.bag_size}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Best Before:</span>{" "}
                      <span className="inline-block px-3 py-1 rounded-lg text-gray-900 font-medium" style={{
                        background: 'linear-gradient(135deg, #EFE5FF 0%, #DAC4FF 100%)'
                      }}>
                        {item.best_before_time 
                          ? formatTime(item.best_before_time)
                          : formatTime(item.window_end_time + 3600) // Add 1 hour (3600 seconds)
                        }
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Window Start:</span>{" "}
                      <span className="text-gray-900">{formatTime(item.window_start_time)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Window End:</span>{" "}
                      <span className="text-gray-900">{formatTime(item.window_end_time)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t bg-gray-50">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verify Modal */}
      {verifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Enter Order Code</h2>
              <button onClick={() => setVerifyModalOpen(false)}>
                <XMarkIcon className="h-6 w-6 text-gray-400 hover:text-gray-900" />
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