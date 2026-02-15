// vendor-web-app/components/sections/bussiness/coupons/CouponModal.jsx
import React from "react";
import { XMarkIcon, CalendarIcon, TagIcon, CurrencyDollarIcon, ClockIcon } from "@heroicons/react/24/outline";
import { formatTime } from "../../../../utility/FormatTime";

const CouponModal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  const DetailSection = ({ icon: Icon, title, children, iconColor }) => (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  const DetailRow = ({ label, value, isHighlight = false }) => (
    <div className="flex justify-between">
      <span className="text-sm text-gray-600">{label}:</span>
      <span className={`text-sm font-medium ${isHighlight ? 'text-lg font-semibold' : 'text-gray-900'} ${isHighlight === 'green' ? 'text-green-600' : isHighlight === 'blue' ? 'text-blue-600' : ''}`}>
        {value}
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <TagIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Coupon Details</h2>
              <p className="text-sm text-gray-500">View complete information</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Coupon Image */}
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg border-4 border-gray-50">
              <img src={item.image_url} alt="Coupon" className="h-full w-full object-cover" />
            </div>
          </div>

          {/* Coupon Code */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-100">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-600 mb-1">Coupon Code</div>
              <div className="text-2xl font-semibold text-gray-900 font-mono tracking-wider">{item.code}</div>
              <div className="text-sm text-gray-500 mt-1">{item.name}</div>
            </div>
          </div>

          {/* Main Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <DetailSection icon={CurrencyDollarIcon} title="Discount" iconColor="text-green-600">
              <div className="space-y-2">
                <DetailRow label="Type" value={item.discount_type} />
                <DetailRow label="Value" value={`${item.discount_type === "PERCENTAGE" ? "%" : "₹"}${item.discount_value}`} isHighlight="green" />
                <DetailRow label="Min Order" value={`₹${item.min_order_value}`} />
                {item.max_discount && <DetailRow label="Max Discount" value={`₹${item.max_discount}`} />}
              </div>
            </DetailSection>

            <DetailSection icon={ClockIcon} title="Usage" iconColor="text-blue-600">
              <div className="space-y-2">
                <DetailRow label="Times Used" value={item.times_used} isHighlight="blue" />
                <DetailRow label="Limit" value={item.usage_limit ? item.usage_limit : "No limit"} />
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {item.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </DetailSection>
          </div>

          {/* Validity Period */}
          <DetailSection icon={CalendarIcon} title="Validity Period" iconColor="text-purple-600" className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Valid From</div>
                <div className="text-sm font-medium text-gray-900">{formatTime(item.valid_from)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Valid Till</div>
                <div className="text-sm font-medium text-gray-900">{formatTime(item.valid_until)}</div>
              </div>
            </div>
          </DetailSection>

          {/* Additional Details */}
          <DetailSection icon={TagIcon} title="Additional Details" iconColor="text-gray-600">
            <div className="space-y-2">
              <DetailRow label="Coupon Type" value={item.coupon_type?.replace(/_/g, " ") || "N/A"} />
              <DetailRow label="Created At" value={formatTime(item.created_at)} />
            </div>
          </DetailSection>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-100 bg-gray-50">
          <button onClick={onClose} className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponModal;