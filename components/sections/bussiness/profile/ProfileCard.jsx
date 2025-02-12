"use client";

import React, { useEffect, useState } from "react";
import { locationIconSvg, plusIconSvg } from "../../../../svgs";
import Tabs from "./Tabs";
import { setOpenDrawer } from "../../../../redux/slices/addCategorySlice";
import { useDispatch } from "react-redux";

import AddCategoryDrawer from "../../../drawers/AddCategoryDrawer";
import axiosClient from "../../../../AxiosClient";
import { PencilIcon } from "@heroicons/react/20/solid";

const ProfileCard = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [image, setImage] = useState("");
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
        setImage(response.data.logo_url);
      } catch (err) {
        console.error("Error fetching vendor data:", err);
        setError(err.response?.data || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosClient.post(
        "/v1/vendor/me/images/upload?image_type=logo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.url) {
        setImage(response.data.url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5 w-[100%] lg:w-[60%] md:w-[60%] p-5 border border-gray-100 rounded-md">
        <div className="flex space-x-4">
          <div className="relative w-[120px] h-[120px]">
            <img
              alt="User"
              src={image}
              className="rounded-full w-full h-full object-cover"
            />

            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="imageUpload"
              onChange={handleImageChange}
            />

            <label
              htmlFor="imageUpload"
              className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full shadow-md cursor-pointer flex items-center justify-center"
            >
              <PencilIcon className="w-4 h-4 text-[#7a48e3]" />
            </label>
          </div>

          <div className="flex flex-col lg:mt-5 lg:gap-y-2">
            <p className="text-lg font-semibold text-gray-900">
              {vendorData?.store_manager_name || "Loading..."}
            </p>
            <div className="flex items-center text-grayOne font-[600] space-x-2">
              {locationIconSvg}
              <p className="text-sm">Location</p>
            </div>
          </div>
        </div>
        {/* <p className="text-left leading-5 text-graySeven font-medium">
          {vendorData?.description || "Loading..."}
        </p> */}
        <Tabs />
      </div>
      {true && (
        <AddCategoryDrawer items={categories} setCategories={setCategories} />
      )}
    </>
  );
};

export default ProfileCard;
