import { useState } from "react";

const StatusDropdown = ({
  initialStatus,
  onStatusChange,
  bagDate,
  cancelled,
  disabled,
}) => {
  // Determine the status based on the bagDate

  const [optionStatus, setOptionStatus] = useState(initialStatus);

  const getStatus = (dateArray) => {
    const now = new Date();
    for (let dateObj of dateArray) {
      const { date, starttime, endtime } = dateObj;
      const startDateTime = new Date(`${date}T${starttime}`);
      const endDateTime = new Date(`${date}T${endtime}`);

      if (now >= startDateTime && now <= endDateTime) {
        return "active";
      } else if (now < startDateTime) {
        return "scheduled";
      }
    }
    return "past";
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
