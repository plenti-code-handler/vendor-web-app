"use client";

import { useEffect, useState } from "react";
import axiosClient from "../../../../AxiosClient";
import { toast } from "sonner";
import OrdersFilter from "../../../dropdowns/OrdersFilter";

import { formatTime } from "../../../../utility/FormateTime";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const [showAlert, setShowAlert] = useState(false);

  const handleDelete = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    const fetchRecentOrders = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(
          "/v1/vendor/order/get?skip=0&limit=10"
        );

        console.log("all orders data");
        console.log(response.data);
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

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[800px] table-auto bg-white">
          <thead>
            <tr className="border-b text-sm font-semibold text-gray-500">
              <th className="pb-2 px-2 pt-4 text-center">Transaction amount</th>

              <th className="pb-2 px-2 pt-4 text-center">Window Start Time</th>
              <th className="pb-2 px-2 pt-4 text-center">Window End Time</th>
              <th className="pb-2 px-2 pt-4 text-center">Created At</th>
              <th className="pb-2 px-2 pt-4 text-center">Status</th>
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
                          case "READY_FOR_PICKUP":
                            return "bg-yellow-500";
                          case "PICKED_UP":
                            return "bg-green-500";
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
    </div>
  );
};

export default RecentOrders;
