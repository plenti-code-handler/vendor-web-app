"use client";

import { useDispatch } from "react-redux";
import { businessStarSvg, locationIconSvg } from "../../../../svgs";
import React, { useEffect } from "react";
import { setActivePage } from "../../../../redux/slices/headerSlice";

const BusinessProfileCard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage("Users"));
  }, [dispatch]);
  return (
    <>
      <div className="flex space-x-4">
        <img
          alt="User"
          src="/User.png"
          className="rounded-full h-24 w-24 sm:h-40 sm:w-40 object-cover"
        />
        <div className="flex gap-5">
          <div className="flex flex-col lg:mt-5 lg:gap-y-2">
            <p className="text-lg font-semibold text-gray-900">McDonald's</p>
            <div className="flex items-center text-grayOne font-semibold space-x-2">
              {locationIconSvg}
              <p className="text-sm">1425 Edinburg, United Kingdom</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="bg-mainThree border border-mainThree rounded-md px-3 py-1">
                <p className="text-mainTwo text-sm font-medium">Category 1</p>
              </div>
              <div className="bg-mainThree border border-mainThree rounded-md px-3 py-1">
                <p className="text-mainTwo text-sm font-medium">Category 2</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center lg:mt-5 lg:gap-y-2 lg:ml-12 md:gap-y-2 md:ml-12">
            <p className="text-black font-semibold text-[14px]">Rating</p>
            <div className="flex gap-2 items-center">
              {businessStarSvg}
              <p className="text-starItem font-bold text-[18px]">5.0</p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-left leading-5 text-graySeven font-medium text-[16px]">
        Outlines keep you honest. They stop you from indulging in poorly
        thought-out metaphors about driving and keep you focused on the overall
        structure of your post Outlines keep you honest. They stop you from
        indulging in poorly thought-out metaphors about driving and keep you
        focused on the overall structure of your post
      </p>
    </>
  );
};

export default BusinessProfileCard;
