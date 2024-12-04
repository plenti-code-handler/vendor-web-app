"use client";
import { useEffect, useState } from "react";
import { arrowDownGray } from "../../svgs";

const BookingsFilter = ({ selectedFilter, onFilterChange }) => {
  const [currLang, setCurrLang] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLang = localStorage.getItem("lang");
      if (storedLang) {
        setCurrLang(storedLang);
      }
    }
  }, []);

  return (
    <form className="w-full sm:w-[125px] lg:min-w-[200px]">
      <div className="relative">
        <select
          id="bookings"
          className="bg-grayFive text-grayThree text-sm font-semibold rounded-lg focus:ring-grayTwo focus:border-grayTwo block w-full p-2.5 appearance-none"
          value={selectedFilter}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="active" className="text-base truncate">
            {`Active ${currLang === "en" ? "Bags" : "Pouches"}  `}
          </option>
          <option value="past" className="text-base truncate">
            {`Past ${currLang === "en" ? "Bags" : "Pouches"}  `}
          </option>
          <option value="scheduled" className="text-base truncate">
            {`Scheduled ${currLang === "en" ? "Bags" : "Pouches"}  `}
          </option>
          <option value="cancelled" className="text-base truncate">
            Cancel
          </option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 lg:pr-1">
          {arrowDownGray}
        </div>
      </div>
    </form>
  );
};

export default BookingsFilter;
