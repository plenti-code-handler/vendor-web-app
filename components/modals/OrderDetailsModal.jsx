import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { formatTime } from "../../utility/FormateTime";
import BagSizeTag from "../common/BagSizeTag";
import { ITEM_TYPE_DISPLAY_NAMES } from "../../constants/itemTypes";

const OrderDetailsModal = ({ isOpen, onClose, orderDetails }) => {
  if (!isOpen || !orderDetails?.items?.length) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fade-down">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6 text-gray-400 hover:text-gray-900" />
          </button>
        </div>
        
        {/* Scrollable Items */}
        <div className="overflow-y-auto max-h-[70vh] px-6 py-4 space-y-6">
          {orderDetails.items.map((item, index) => (
            <div key={item.item_id || index} className="rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col md:flex-row gap-4 bg-gray-50">
              <img
                src={item.image_url}
                alt="Item"
                className="h-32 w-32 object-cover rounded-lg border"
              />
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Type:</span>{" "}
                  <span className="text-gray-900">{ITEM_TYPE_DISPLAY_NAMES[item.item_type] || item.item_type.replace(/_/g, " ")}</span>
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
                  <BagSizeTag bagSize={item.bag_size} showIcon={true} />
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
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;