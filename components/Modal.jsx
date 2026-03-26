"use client";

import React from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  XMarkIcon,
  ClockIcon,
  TagIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { formatDateTime } from "../utility/FormatTime";
import { useSelector } from "react-redux";
import { ITEM_TYPE_ICONS, ITEM_TYPE_DISPLAY_NAMES } from "../constants/itemTypes";

const Modal = ({ isOpen, onClose, item }) => {
  const pricing = useSelector((state) => state.catalogue.pricing);

  // Keep the modal mounted while closing so transitions can run.
  if (!item) return null;

  // Get prices from catalogue: match by item_type and pricing_id (or default)
  const getPrices = () => {
    const pricingId = item.pricing_id ?? "default";
    const entry = (pricing || []).find(
      (e) => String(e.item_type) === String(item.item_type) && (e.id ?? "default") === pricingId
    ) || (pricing || []).find((e) => String(e.item_type) === String(item.item_type));
    if (entry?.bags) {
      return {
        small: entry.bags.SMALL ?? "N/A",
        medium: entry.bags.MEDIUM ?? "N/A",
        large: entry.bags.LARGE ?? "N/A"
      };
    }
    return { small: "N/A", medium: "N/A", large: "N/A" };
  };

  const prices = getPrices();
  const itemIcon = ITEM_TYPE_ICONS[item.item_type] || "🍽️";
  const itemDisplayName = ITEM_TYPE_DISPLAY_NAMES[item.item_type] || item.item_type.replace(/_/g, " ");

  // Format allergens for display
  const formatAllergens = (allergens) => {
    if (!allergens || allergens.length === 0) return "None";
    return allergens.join(", ");
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/40 transition-opacity duration-300 data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 flex items-end justify-center">
        <DialogPanel
          transition
          className="w-full max-w-2xl p-2 pt-5 h-full max-h-[85vh] flex flex-col rounded-t-2xl bg-white shadow-xl transform transition duration-300 ease-out data-[closed]:translate-y-full"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{itemIcon}</div>
              <div>
                <h2 className="text-lg font-semibold">{itemDisplayName}</h2>
                <p className="text-gray-500 text-sm">Item Details</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
            {/* Description */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <TagIcon className="h-4 w-4 text-[#5F22D9]" />
                Description
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {item.description || "No description available"}
              </p>
            </div>

            {/* Servings Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-[#5F22D9]/30 transition-colors duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <h3 className="font-medium text-gray-900 text-sm">Veg Servings Left</h3>
                </div>
                <p className="text-xl font-semibold text-gray-900">
                  {item.veg_servings_current || 0}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-[#5F22D9]/30 transition-colors duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <h3 className="font-medium text-gray-900 text-sm">
                    Non-Veg Servings Left
                  </h3>
                </div>
                <p className="text-xl font-semibold text-gray-900">
                  {item.non_veg_servings_current || 0}
                </p>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <TagIcon className="h-4 w-4 text-[#5F22D9]" />
                Pricing
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-600 mb-1">Small</p>
                    <p className="text-lg font-semibold text-[#5F22D9]">
                      ₹{prices.small}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-600 mb-1">Medium</p>
                    <p className="text-lg font-semibold text-[#5F22D9]">
                      ₹{prices.medium}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-600 mb-1">Large</p>
                    <p className="text-lg font-semibold text-[#5F22D9]">
                      ₹{prices.large}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Allergens */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <ExclamationTriangleIcon className="h-4 w-4 text-[#5F22D9]" />
                Allergens
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.allergens && item.allergens.length > 0 ? (
                  item.allergens.map((allergen, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#5F22D9]/10 text-[#5F22D9] text-xs font-medium rounded-full border border-[#5F22D9]/20"
                    >
                      {formatAllergens([allergen])}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No allergens listed</span>
                )}
              </div>
            </div>

            {/* Timing Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-[#5F22D9]" />
                Timing Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Window Start:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDateTime(item.window_start_time) || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Window End:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDateTime(item.window_end_time) || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Best Before:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDateTime(item.best_before_time) || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Created:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDateTime(item.created_at) || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 text-sm rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default Modal;
