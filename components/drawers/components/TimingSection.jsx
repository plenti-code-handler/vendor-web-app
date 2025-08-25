import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InfoIcon from '../../common/InfoIcon';

const TimingSection = ({ 
  windowStartTime, 
  setWindowStartTime, 
  windowEndTime, 
  setWindowEndTime, 
  bestBeforeTime, 
  setBestBeforeTime,
  handleStartTimeChange,
  handleEndTimeChange,
  handleBestBeforeTimeChange
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Timing & Availability</h3>
        <InfoIcon content="Set when customers can pick up and when food expires" />
      </div>
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Window Start Time</label>
          <DatePicker
            selected={windowStartTime}
            onChange={handleStartTimeChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMM d, yyyy h:mm aa"
            minDate={new Date()}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Window End Time</label>
          <DatePicker
            selected={windowEndTime}
            onChange={handleEndTimeChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMM d, yyyy h:mm aa"
            minDate={windowStartTime}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Best Before Time</label>
          <DatePicker
            selected={bestBeforeTime}
            onChange={handleBestBeforeTimeChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMM d, yyyy h:mm aa"
            minDate={windowEndTime}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
};

export default TimingSection;
