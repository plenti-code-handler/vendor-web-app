import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { formatTime } from "../../../../utility/FormateTime";

const Modal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Coupon Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            <img
              src={item.image_url}
              alt="Coupon"
              className="w-32 h-32 object-cover rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Code</label>
              <p className="text-lg font-semibold">{item.code}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg">{item.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Discount Type
              </label>
              <p className="text-lg">{item.discount_type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Discount Value
              </label>
              <p className="text-lg">
                {item.discount_type === "PERCENTAGE" ? "%" : "₹"}
                {item.discount_value}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Min Order Value
              </label>
              <p className="text-lg">₹{item.min_order_value}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Max Discount
              </label>
              <p className="text-lg">
                {item.max_discount ? `₹${item.max_discount}` : "No limit"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Usage Limit
              </label>
              <p className="text-lg">
                {item.usage_limit ? item.usage_limit : "No limit"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Times Used
              </label>
              <p className="text-lg">{item.times_used}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Valid From
            </label>
            <p className="text-lg">{formatTime(item.valid_from)}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Valid Till
            </label>
            <p className="text-lg">{formatTime(item.valid_until)}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.is_active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {item.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;