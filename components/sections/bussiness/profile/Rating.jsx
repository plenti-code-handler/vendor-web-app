"use client";

import React from "react";
import { starSvg } from "../../../../svgs";
import CustomerReviews from "./CustomerReviews";
import { useSelector } from "react-redux";

const Rating = () => {
  const ratings = [
    { level: 5, percentage: 100 },
    { level: 4, percentage: 80 },
    { level: 3, percentage: 55 },
    { level: 2, percentage: 38 },
    { level: 1, percentage: 18 },
  ];

  const successOpen = useSelector((state) => state.withdrawSuccess.drawerOpen);
  const amountOpen = useSelector((state) => state.withdrawAmount.drawerOpen);

  return (
    <div className="flex flex-col lg:w-[120%]">
      <div className="flex gap-8">
        {/* Rating Bars */}
        <div className="flex flex-col gap-2 flex-1 ">
          {ratings.map(({ level, percentage }) => (
            <div key={level} className="flex items-center gap-2">
              <p className="w-6 text-center">{level}</p>
              <div className="relative flex-1">
                <div
                  className={`absolute inset-0 bg-[#FFB400] rounded-sm ${
                    successOpen || amountOpen ? "" : "z-10"
                  }`}
                  style={{ width: `${percentage}%`, height: "10px" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gray-200 rounded-sm"
                  style={{ height: "10px" }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback Summary */}
        <div className="flex flex-col items-start flex-shrink-0 justify-center">
          <div className="flex items-center gap-2">
            <p className="text-black text-[40px] font-bold">4.5</p>
            {starSvg}
          </div>
          <p className="text-[#9796A1] text-[14px] font-medium mt-1">
            273 Reviews
          </p>
        </div>
      </div>
      <CustomerReviews />
    </div>
  );
};

export default Rating;
