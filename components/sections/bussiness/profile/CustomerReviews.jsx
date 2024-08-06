"use client";
import { placeholderRatingStarSvg, ratingStarSvg } from "../../../../svgs";
import React from "react";

const CustomerReviews = () => {
  return (
    <div className="flex flex-col mt-5">
      <p className="text-black font-semibold text-[16px] mb-3">
        Customer's Reviews
      </p>
      <div className="flex flex-col gap-1 shadow-md transform translate-y-[-2px] p-2 bg-white rounded-lg lg:w-[100%]">
        <div className="flex justify-between">
          <div className="flex gap-1 items-center">
            <img
              alt="User"
              src="/User.png"
              className="rounded-full h-10 w-10 object-cover"
            />
            <p className="font-semibold text-[14px] text-black">Deepak Kumar</p>
            <p className="font-medium text-2xl text-dividerComment mb-3">.</p>
            <p className="font-medium text-[12px] text-dividerComment">
              2d ago
            </p>
          </div>
          <div className="flex gap-0.5">
            {ratingStarSvg}
            {ratingStarSvg}
            {ratingStarSvg}
            {ratingStarSvg}
            {placeholderRatingStarSvg}
          </div>
        </div>
        <div>
          <p className="text-comment text-[12px] font-medium">
            Et vero qui aspernatur repellendus molestiae. Tempora reiciendis aut
            beatae beatae eos aut. Quia ut minima consequuntur aut est enim.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;
