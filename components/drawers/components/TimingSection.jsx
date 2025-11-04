import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InfoIcon from '../../common/InfoIcon';

const TimingSection = ({ 
  windowStartTime, 
  windowEndTime, 
  bestBeforeTime, 
  handleStartTimeChange,
  windowDuration,
  setWindowDuration,
  bestBeforeDuration,
  setBestBeforeDuration
}) => {
  const windowDurationOptions = [
    { label: '15 minutes', value: 15 },
    { label: '30 minutes', value: 30 },
    { label: '45 minutes', value: 45 },
    { label: '1 hour', value: 60 },
    { label: '1 hour 15 minutes', value: 75 },
    { label: '1 hour 30 minutes', value: 90 },
    { label: '1 hour 45 minutes', value: 105 },
    { label: '2 hours', value: 120 },
    { label: '2 hours 30 minutes', value: 150 },
    { label: '3 hours', value: 180 },
    { label: '3 hours 30 minutes', value: 210 },
    { label: '4 hours', value: 240 },
    { label: '5 hours', value: 300 },
    { label: '6 hours', value: 360 },
    { label: '7 hours', value: 420 },
    { label: '8 hours', value: 480 },
    { label: '9 hours', value: 540 },
    { label: '10 hours', value: 600 },
    { label: '11 hours', value: 660 },
    { label: '12 hours', value: 720 },
  ];

  // Quick select buttons for window duration
  const quickWindowDurations = [
    { label: '45m', value: 45 },
    { label: '1h', value: 60 },
    { label: '1h 15m', value: 75 },
    { label: '1h 30m', value: 90 }
  ];


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
            dateFormat="MMM d, yyyy HH:mm"
            minDate={new Date()}
            timeCaption="Time"
            strictParsing
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">Pickup Window Duration</label>
          
          {/* Quick select buttons */}
          <div className="flex gap-2 mb-3">
            {quickWindowDurations.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setWindowDuration(option.value)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  windowDuration === option.value
                    ? 'bg-[#5f22d9] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Dropdown for more options */}
          <select
            value={windowDuration}
            onChange={(e) => setWindowDuration(Number(e.target.value))}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200 bg-white"
          >
            {windowDurationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2">
            Window ends at: {new Date(windowStartTime.getTime() + windowDuration * 60000).toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">Best Before Duration (after pickup)</label>
          
          {/* Quick select buttons */}
          <div className="flex gap-2 mb-3">
            {quickWindowDurations.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setBestBeforeDuration(option.value)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  bestBeforeDuration === option.value
                    ? 'bg-[#5f22d9] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Dropdown for more options */}
          <select
            value={bestBeforeDuration}
            onChange={(e) => setBestBeforeDuration(Number(e.target.value))}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200 bg-white"
          >
            {windowDurationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2">
            Best before: {new Date(windowStartTime.getTime() + (windowDuration + bestBeforeDuration) * 60000).toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimingSection;
