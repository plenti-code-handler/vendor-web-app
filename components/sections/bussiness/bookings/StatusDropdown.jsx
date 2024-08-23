"use client";

import React, { useState } from "react";

const StatusDropdown = ({ initialStatus, onStatusChange }) => {
  const [status, setStatus] = useState(initialStatus);

  const handleChange = (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    onStatusChange(newStatus);
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      className={` ${
        status.toLowerCase() === "active"
          ? "bg-notPickedBg text-notPickedText"
          : "bg-pickedBg text-pickedText "
      } font-semibold p-1 rounded-md text-sm cursor-pointer text-center`}
    >
      <option
        value="past"
        className="bg-pickedBg text-pickedText font-semibold p-1 rounded-md text-sm cursor-pointer text-center"
      >
        Picked
      </option>
      <option
        value="active"
        className="bg-notPickedBg text-notPickedText  font-semibold p-1 rounded-md text-sm cursor-pointer text-center"
      >
        Not Picked
      </option>
    </select>
  );
};

export default StatusDropdown;
