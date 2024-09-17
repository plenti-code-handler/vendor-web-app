import { useState } from "react";

const StatusDropdown = ({
  initialStatus,
  onStatusChange,
  bagDate,
  cancelled,
  disabled,
  starttime,
  endtime,
}) => {
  // Determine the status based on the bagDate

  const [optionStatus, setOptionStatus] = useState(initialStatus);

  const getStatus = (dateArray) => {
    const now = new Date();

    let activeCount = 0;
    let scheduledCount = 0;
    let pastCount = 0;

    const startDateTime = starttime.toDate(); // Convert Firebase timestamp to JavaScript Date
    const endDateTime = endtime.toDate(); // Convert Firebase timestamp to JavaScript Date

    // Perform the status

    if (now >= startDateTime && now <= endDateTime) {
      activeCount++;
    } else if (now < startDateTime) {
      scheduledCount++;
    } else {
      pastCount++;
    }

    const currDate = new Date();
    const bookingEndTime = endtime.toDate();

    if (initialStatus === "picked" || currDate > bookingEndTime) {
      return "past";
    }

    if (activeCount > 0) {
      return "active";
    } else if (scheduledCount > 0) {
      return "scheduled";
    } else {
      return "past";
    }
  };

  const handleChange = (event) => {
    const newStatus = event.target.value;
    setOptionStatus(newStatus);
    onStatusChange(newStatus);
  };

  const status = getStatus(bagDate);

  if (cancelled) {
    return (
      <select
        disabled
        value="cancel"
        className="bg-[#FFCFD6] text-[#A0172D] font-semibold p-1 rounded-md text-sm cursor-not-allowed text-center"
      >
        <option value="cancel">Cancelled</option>
      </select>
    );
  } else if (status === "scheduled") {
    return (
      <select
        disabled
        value="scheduled"
        className="bg-scheduledBg text-badgeScheduled font-semibold p-1 rounded-md text-sm cursor-not-allowed text-center"
      >
        <option value="scheduled">Scheduled</option>
      </select>
    );
  } else if (status === "past") {
    return (
      <select
        disabled
        value="scheduled"
        className={`${
          optionStatus.toLowerCase() === "picked"
            ? "bg-grayFive text-green-400"
            : "bg-grayFive text-red-400"
        } font-semibold p-1 rounded-md text-sm cursor-not-allowed text-center`}
      >
        <option value={initialStatus}>
          {initialStatus.charAt(0).toUpperCase() + initialStatus.slice(1)}
        </option>
      </select>
    );
  }

  // For 'active' and 'past' statuses
  return (
    <select
      disabled={disabled}
      value={optionStatus}
      onChange={handleChange}
      className={`${
        optionStatus === "picked"
          ? "bg-grayFive text-green-400"
          : "bg-grayFive text-red-400"
      } font-semibold p-1 rounded-md text-sm text-center ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <option className="text-green-400" value="picked">
        Picked
      </option>
      <option className="text-red-400" value="not picked">
        Not Picked
      </option>
    </select>
  );
};

export default StatusDropdown;
