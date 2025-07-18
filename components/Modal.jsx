import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { formatTime, formatTimestamp } from "../utility/FormateTime";

const Modal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg md:max-w-lg">
        <div className="flex justify-between border-b pb-3">
          <h2 className="text-lg font-semibold">Product Details</h2>
          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6 text-gray-600 hover:text-gray-900" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <span className="font-medium">Type:</span>{" "}
            {item.item_type.replace(/_/g, " ") || "N/A"}
          </div>
          <div>
            <span className="font-medium">Tags:</span>{" "}
            {item.tags && item.tags.length > 0
              ? item.tags
                  .map((tag) => tag.replace(/_/g, " ").toLowerCase())
                  .map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1))
                  .join(", ")
              : "N/A"}
          </div>
          <div>
            <span className="font-medium">Vegetarian:</span>{" "}
            {item.veg ? "Yes" : "No"}
          </div>

          <div>
            <span className="font-medium">Stock:</span> {item.quantity || "N/A"}
          </div>
          <div>
            <span className="font-medium">Price:</span> ${item.price || "N/A"}
          </div>
          <div>
            <span className="font-medium">Acutal Price:</span> $
            {item.actual_price || "N/A"}
          </div>
          <div>
            <span className="font-medium mr-1">Window Start Time:</span>
            {formatTimestamp(item.window_start_time) || "N/A"}
          </div>
          <div>
            <span className="font-medium mr-1">Window End Time:</span>
            {formatTimestamp(item.window_end_time) || "N/A"}
          </div>
          <div>
            <span className="font-medium mr-1">Created At:</span>
            {formatTimestamp(item.created_at) || "N/A"}
          </div>
          <div>
            <span className="font-medium ">Description:</span>{" "}
            {item.description || "No description available"}
          </div>
        </div>

        <div className="mt-5 flex justify-end">
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

export default Modal;
