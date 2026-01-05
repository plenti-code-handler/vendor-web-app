import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";

const DateSelection = ({ selectedDates, setSelectedDates }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [errors, setErrors] = useState({}); 

  const handleDateChange = (index, field, value) => {
    setSelectedDates((prevDates) =>
      prevDates.map((date, i) =>
        i === index ? { ...date, [field]: value } : date
      )
    );

    if (field === "endtime") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [index]:
          value < selectedDates[index]?.starttime ? "Invalid end time" : "",
      }));
    }
  };

  const removeDate = (index) => {
    setSelectedDates((prevDates) => prevDates.filter((_, i) => i !== index));
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[index];
      return newErrors;
    });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col pb-5 mt-4 gap-1">
      <p className="text-black font-semibold text-xl">Date & Time</p>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedDates((state) => [
              ...state,
              {
                date: e.target.value,
                starttime: "",
                endtime: "",
                isEditable: true,
              },
            ]);
            setSelectedDate("");
          }}
          className="block w-full placeholder:font-semibold rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Select Date"
          min={
            selectedDates.length > 0
              ? selectedDates[selectedDates.length - 1].date
              : today
          }
        />
      </form>

      {selectedDates.length !== 0 && (
        <>
          <div className="flex items-center justify-between pb-3 mt-4 gap-2">
            <p className="text-black font-semibold text-xl">Selected Dates</p>
          </div>
          {selectedDates.map((date, index) => (
            <div key={index} className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <input
                  type="date"
                  value={date.date || ""}
                  onChange={(e) =>
                    handleDateChange(index, "date", e.target.value)
                  }
                  disabled={!date.isEditable}
                  className={`block placeholder:font-semibold rounded-lg border border-gray-300 py-2 px-2 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black ${
                    !date.isEditable ? "bg-gray-200" : ""
                  }`}
                  placeholder="Select Date"
                  min={today}
                />
                <input
                  type="time"
                  value={date.starttime || ""}
                  onChange={(e) => {
                    const startTime = e.target.value;
                    handleDateChange(index, "starttime", startTime);
                    handleDateChange(index, "endtime", startTime);
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      [index]: "",
                    }));
                  }}
                  disabled={!date.isEditable}
                  className={`block placeholder:font-semibold rounded-lg border border-gray-300 py-2 px-2 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black ${
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
                  min={date.starttime || ""}
                  disabled={!date.isEditable}
                  className={`block placeholder:font-semibold rounded-lg border ${
                    errors[index] ? "border-red-500" : "border-gray-300"
                  } py-2 px-2 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    errors[index] ? "focus:ring-red-500" : "focus:ring-black"
                  } ${!date.isEditable ? "bg-gray-200" : ""}`}
                  placeholder="End Time"
                />
                {date.isEditable && (
                  <XMarkIcon
                    width={15}
                    height={15}
                    onClick={() => removeDate(index)}
                    className="cursor-pointer text-gray-600"
                  />
                )}
              </div>
              {errors[index] && (
                <p className="text-red-500 text-xs mt-1 w-full flex justify-end pr-8">
                  {errors[index]}
                </p>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default DateSelection;
