import React, { useState } from "react";
import { ChevronUpIcon, XMarkIcon } from "@heroicons/react/20/solid";

const DateSelection = ({ selectedDates, setSelectedDates }) => {
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (index, field, value) => {
    setSelectedDates((prevDates) =>
      prevDates.map((date, i) =>
        i === index ? { ...date, [field]: value } : date
      )
    );
  };

  const removeDate = (index) => {
    setSelectedDates((prevDates) => prevDates.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="flex flex-col pb-5 mt-4 gap-1">
        <p className="text-black font-bold text-[20px]">Date & Time</p>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedDates((state) => {
                return [
                  ...state,
                  {
                    date: e.target.value,
                    starttime: "",
                    endtime: "",
                    isEditable: true,
                  }, // New dates are editable
                ];
              });
              setSelectedDate("");
            }}
            className="block w-full placeholder:font-bold rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Select Date"
          />
        </form>

        {selectedDates.length !== 0 && (
          <>
            <div className="flex items-center justify-between pb-3 mt-4 gap-2">
              <p className="text-black font-bold text-[20px]">Selected Dates</p>
              <ChevronUpIcon width="20px" height="20px" />
            </div>
            {selectedDates.map((date, index) => (
              <div key={index} className="flex items-center gap-1">
                <input
                  type="date"
                  value={date.date || ""}
                  onChange={(e) =>
                    handleDateChange(index, "date", e.target.value)
                  }
                  disabled={!date.isEditable} // Disable if it's not editable
                  className={`block placeholder:font-bold rounded-lg border border-gray-300 py-2 px-2 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black ${
                    !date.isEditable ? "bg-gray-200" : ""
                  }`}
                  placeholder="Select Date"
                />
                <input
                  type="time"
                  value={date.starttime || ""}
                  onChange={(e) =>
                    handleDateChange(index, "starttime", e.target.value)
                  }
                  disabled={!date.isEditable} // Disable if it's not editable
                  className={`block placeholder:font-bold rounded-lg border border-gray-300 py-2 px-2 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black ${
                    !date.isEditable ? "bg-gray-200" : ""
                  }`}
                  placeholder="Start Time"
                />
                <input
                  type="time"
                  value={date.endtime || ""}
                  onChange={(e) =>
                    handleDateChange(index, "endtime", e.target.value)
                  }
                  disabled={!date.isEditable} // Disable if it's not editable
                  className={`block placeholder:font-bold rounded-lg border border-gray-300 py-2 px-2 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black ${
                    !date.isEditable ? "bg-gray-200" : ""
                  }`}
                  placeholder="End Time"
                />
                {date.isEditable && (
                  <XMarkIcon
                    width={15}
                    height={15}
                    onClick={() => removeDate(index)}
                  />
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default DateSelection;
