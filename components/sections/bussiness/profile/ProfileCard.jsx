"use client";

import React, { useEffect, useState } from "react";
import { locationIconSvg, plusIconSvg } from "../../../../svgs";
import Tabs from "./Tabs";
import { setOpenDrawer } from "../../../../redux/slices/addCategorySlice";
import { useDispatch } from "react-redux";
import { getUserLocal } from "../../../../redux/slices/loggedInUserSlice";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../app/firebase/config";
import AddCategoryDrawer from "../../../drawers/AddCategoryDrawer";
import axiosClient from "../../../../AxiosClient";

const ProfileCard = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [categories, setCategories] = useState([]);
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleAddCategory = () => {
    dispatch(setOpenDrawer(true));
  };

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axiosClient.get("/v1/vendor/me/get", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setVendorData(response.data);
      } catch (err) {
        console.error("Error fetching vendor data:", err);
        setError(err.response?.data || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-5 w-[100%] lg:w-[60%] md:w-[60%] p-5 border border-gray-100 rounded-md">
        <div className="flex space-x-4">
          <img
            alt="User"
            src={vendorData?.logo_url || "/User.png"}
            className="rounded-full h-[120px] w-[120px] object-cover"
          />

          <div className="flex flex-col lg:mt-5 lg:gap-y-2">
            <p className="text-lg font-semibold text-gray-900">
              {vendorData?.store_manager_name || "Loading..."}
            </p>
            <div className="flex items-center text-grayOne font-[600] space-x-2">
              {locationIconSvg}
              <p className="text-sm">Location</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="bg-mainThree border border-mainThree rounded-md px-3 py-1">
                <p className="text-mainTwo text-sm font-medium">Category</p>
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
      {true && (
        <AddCategoryDrawer items={categories} setCategories={setCategories} />
      )}
    </>
  );
};

export default ProfileCard;
