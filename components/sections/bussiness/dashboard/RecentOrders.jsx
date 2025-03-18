"use client";

import { useEffect, useState } from "react";
import axiosClient from "../../../../AxiosClient";
import { toast } from "sonner";
import OrdersFilter from "../../../dropdowns/OrdersFilter";
import { TrashIcon } from "@heroicons/react/20/solid";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchRecentOrders = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(
          "/v1/vendor/order/get?skip=0&limit=10"
        );
        if (response.status === 200) {
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

      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white">
          <thead>
            <tr className="border-b text-sm font-semibold text-gray-500">
              <th className="pb-2 pl-5 pt-4 text-left">Order Code</th>
              <th className="pb-2 px-2 pt-4 text-center">Window Start Time</th>
              <th className="pb-2 px-2 pt-4 text-center">Window End Time</th>
              <th className="pb-2 px-2 pt-4 text-center">Created At</th>
              <th className="pb-2 px-2 pt-4 text-center">Status</th>
              <th className="pb-2 px-2 pt-4 text-center">Action</th>
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
                  <td className="pl-5 py-3">{order.order_code}</td>
                  <td className="text-center px-2">
                    {formatTimestamp(order.window_start_time)}
                  </td>
                  <td className="text-center px-2">
                    {formatTimestamp(order.window_end_time)}
                  </td>
                  <td className="text-center px-2">
                    {formatTimestamp(order.created_at)}
                  </td>
                  <td className="text-center px-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                        order.current_status === "WAITING_FOR_PICKUP"
                          ? "bg-yellow-500"
                          : order.current_status === "PICKED_UP"
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {order.current_status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="text-center px-2">
                    <button>
                      <TrashIcon className="h-5 w-5 text-red-600 hover:text-red-900" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No orders found for the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
