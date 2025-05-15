import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { formatTime } from "../utility/FormateTime";

const OrderDetailPopup = ({ isOpen, onClose, items = [] }) => {
  if (!isOpen || !items.length) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
        {/* Header */}
        <div className="flex justify-between border-b pb-3">
          <h2 className="text-lg font-semibold">Order Details</h2>
          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6 text-gray-600 hover:text-gray-900" />
          </button>
        </div>

        {/* Scrollable Items List */}
        <div className="mt-4 max-h-[80vh] overflow-y-auto space-y-6 pr-2">
          {items.map((item, index) => (
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
                        tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()
                    )
                    .join(", ") || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Diet:</span> {item.diet}
                </div>
                <div>
                  <span className="font-medium">Quantity:</span> {item.quantity}
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

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPopup;
