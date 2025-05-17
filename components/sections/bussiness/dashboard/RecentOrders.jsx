"use client";

import { useEffect, useRef, useState } from "react";
import axiosClient from "../../../../AxiosClient";
import { toast } from "sonner";
import OrdersFilter from "../../../dropdowns/OrdersFilter";
import { formatTime } from "../../../../utility/FormateTime";
import { EyeIcon, XMarkIcon, shieldCheck } from "@heroicons/react/24/outline";
import { ShieldCheckIcon } from "@heroicons/react/20/solid";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [verifying, setVerifying] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const code = otp.join("");
    console.log("inside handle verify code");
    console.log(selectedOrderId);
    console.log(code);
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
      }
    } catch (error) {
      toast.error("Failed to verify order code");
      console.error(error);
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    const fetchRecentOrders = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(
          "/v1/vendor/order/get?skip=0&limit=10"
        );

        if (response.status === 200) {
          console.log(response.data);
          setOrders(response.data || []);
        }
      } catch (error) {
        toast.error("Failed to fetch orders");
        console.error("Error fetching orders:", error);
      }
      setLoading(false);
    };

    fetchRecentOrders();
  }, []);

  const openModal = async (orderId) => {
    console.log(orderId);
    console.log("inside get order details API function");

    try {
      const response = await axiosClient.get(
        `/v1/vendor/order/${orderId}/items`
      );
      if (response.status === 200) {
        console.log("Response from backend");
        console.log(response.data);
        setSelectedItem({ id: orderId, items: response.data });
        setModalOpen(true);
      } else {
        toast.error("Failed to fetch order details");
      }
    } catch (error) {
      toast.error("Error fetching order items");
      console.error("Order detail fetch error:", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const filteredOrders = filter
    ? orders.filter((order) => order.current_status === filter)
    : orders;

  return (
    <div className="mt-4 w-full border border-gray-200 rounded-xl p-6 sm:px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Orders</h2>
        <OrdersFilter selectedFilter={filter} onFilterChange={setFilter} />
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[800px] table-auto bg-white">
          <thead>
            <tr className="border-b text-sm font-semibold text-gray-500">
              <th className="pb-2 px-2 pt-4 text-center">Transaction amount</th>
              <th className="pb-2 px-2 pt-4 text-center">Window Start Time</th>
              <th className="pb-2 px-2 pt-4 text-center">Window End Time</th>
              <th className="pb-2 px-2 pt-4 text-center">Created At</th>
              <th className="pb-2 px-2 pt-4 text-center">Status</th>
              <th className="pb-2  text-start pt-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="text-center px-2 text-sm whitespace-nowrap">
                    {order.transaction_amount}
                  </td>
                  <td className="text-center px-2 text-sm whitespace-nowrap">
                    {formatTime(order.window_start_time)}
                  </td>
                  <td className="text-center px-2 text-sm whitespace-nowrap">
                    {formatTime(order.window_end_time)}
                  </td>
                  <td className="text-center px-2 text-sm whitespace-nowrap">
                    {formatTimestamp(order.created_at)}
                  </td>
                  <td className="text-center px-2 text-sm whitespace-nowrap">
                    {(() => {
                      const rawStatus = order.current_status;

                      if (!rawStatus) {
                        return (
                          <span className="inline-block px-2 py-1 rounded bg-gray-400 text-white text-xs font-semibold">
                            Not Available
                          </span>
                        );
                      }

                      const status = rawStatus
                        .replace("order.", "")
                        .toUpperCase();

                      const getStatusColor = (status) => {
                        switch (status) {
                          case "CREATED":
                            return "bg-[#7e45ee]";
                          case "WAITING_FOR_PICKUP":
                            return "bg-indigo-500";
                          case "READY_FOR_PICKUP":
                            return "bg-yellow-500";
                          case "PICKED_UP":
                            return "bg-green-500";
                          case "CANCELLED":
                            return "bg-red-500";
                          case "NOT_PICKED_UP":
                            return "bg-orange-500";
                          default:
                            return "bg-blue-500";
                        }
                      };

                      const formattedText = status
                        .toLowerCase()
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase());

                      return (
                        <span
                          className={`inline-block px-2 py-1 rounded text-white text-xs font-semibold whitespace-nowrap ${getStatusColor(
                            status
                          )}`}
                        >
                          {formattedText}
                        </span>
                      );
                    })()}
                  </td>

                  <td className="text-center flex gap-2 px-2 text-sm whitespace-nowrap">
                    <button onClick={() => openModal(order.order_id)}>
                      <EyeIcon className="h-5 w-5 text-gray-600 hover:text-gray-900" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOrderId(order.order_id);
                        setVerifyModalOpen(true);
                      }}
                    >
                      <ShieldCheckIcon className="h-5 w-5 text-gray-600 hover:text-gray-900" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && selectedItem?.items?.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
            <div className="flex justify-between border-b pb-3">
              <h2 className="text-lg font-semibold">Order Details</h2>
              <button onClick={() => setModalOpen(false)}>
                <XMarkIcon className="h-6 w-6 text-gray-600 hover:text-gray-900" />
              </button>
            </div>

            <div className="mt-4 max-h-[80vh] overflow-y-auto space-y-6 pr-2">
              {selectedItem.items.map((item, index) => (
                <div key={item.item_id || index} className="rounded border p-4">
                  <div className="mb-3">
                    <img
                      src={item.image_url}
                      alt="Item"
                      className="h-40 w-full object-cover rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <div>
                      <span className="font-medium">Type:</span>{" "}
                      {item.item_type.replace(/_/g, " ")}
                    </div>
                    <div>
                      <span className="font-medium">Description:</span>{" "}
                      {item.description}
                    </div>
                    <div>
                      <span className="font-medium">Tags:</span>{" "}
                      {item.tags
                        ?.map(
                          (tag) =>
                            tag.charAt(0).toUpperCase() +
                            tag.slice(1).toLowerCase()
                        )
                        .join(", ") || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Diet:</span> {item.diet}
                    </div>
                    <div>
                      <span className="font-medium">Quantity:</span>{" "}
                      {item.quantity}
                    </div>
                    <div>
                      <span className="font-medium">Price:</span> ${item.price}
                    </div>
                    <div>
                      <span className="font-medium">Window Start:</span>{" "}
                      {formatTime(item.window_start_time)}
                    </div>
                    <div>
                      <span className="font-medium">Window End:</span>{" "}
                      {formatTime(item.window_end_time)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {verifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="flex justify-between border-b pb-3">
              <h2 className="text-lg font-semibold">Enter Order Code</h2>
              <button onClick={() => setVerifyModalOpen(false)}>
                <XMarkIcon className="h-6 w-6 text-gray-600 hover:text-gray-900" />
              </button>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  ref={(el) => (inputRefs.current[i] = el)}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  className="w-10 h-10 border border-[#D0D5DD] text-center text-lg rounded focus:outline-adminPrimary"
                />
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleVerifyCode}
                disabled={verifying}
                className={`rounded-md px-4 py-2 text-white ${
                  verifying
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-hoverPrimary"
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
