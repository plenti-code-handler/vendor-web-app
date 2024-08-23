"use client";

import React from "react";
import { locationIconSvg, plusIconSvg } from "../../../../svgs";
import Tabs from "./Tabs";
import { setOpenDrawer } from "../../../../redux/slices/addCategorySlice";
import { useDispatch } from "react-redux";
import { getUserLocal } from "../../../../redux/slices/loggedInUserSlice";

const ProfileCard = () => {
  const dispatch = useDispatch();

  const handleAddCategory = () => {
    dispatch(setOpenDrawer(true));
  };

  const user = getUserLocal();
  return (
    <div className="flex flex-col gap-5 w-[100%] lg:w-[60%] md:w-[60%] p-5 border border-gray-100 rounded-md">
      <div className="flex space-x-4">
        <img
          alt="User"
          src={user.img ? user.img : "/User.png"}
          className="rounded-full h-24 w-24 sm:h-[90%] sm:w-[25%] object-cover"
        />
        <div className="flex flex-col lg:mt-5 lg:gap-y-2">
          <p className="text-lg font-semibold text-gray-900">{user.name}</p>
          <div className="flex items-center text-grayOne font-[600] space-x-2">
            {locationIconSvg}
            <p className="text-sm">{user.loc}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <div className="bg-mainThree border border-mainThree rounded-md px-3 py-1">
              <p className="text-mainTwo text-sm font-medium">Category 1</p>
            </div>
            <div className="bg-mainThree border border-mainThree rounded-md px-3 py-1">
              <p className="text-mainTwo text-sm font-medium">Category 2</p>
            </div>
            <button
              onClick={handleAddCategory}
              className="bg-secondary hover:bg-secondary hover:bg-opacity-80 rounded-[4px] px-3 py-1"
            >
              {plusIconSvg}
            </button>
          </div>
        </div>
      </div>
      <p className="text-left leading-5 text-graySeven font-medium">
        {user.desc}
      </p>
      <Tabs />
    </div>
  );
};

export default ProfileCard;
