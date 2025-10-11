"use client";

import React, { useEffect, useState } from "react";
import { locationIconSvg, plusIconSvg } from "../../../../svgs";
import Tabs from "./Tabs";
import { setOpenDrawer } from "../../../../redux/slices/addCategorySlice";
import { useDispatch } from "react-redux";

import AddCategoryDrawer from "../../../drawers/AddCategoryDrawer";
import BackcoverImageModal from "../../../modals/BackcoverImageModal";
import axiosClient from "../../../../AxiosClient";
import { PencilIcon } from "@heroicons/react/20/solid";
import OnlineOfflineToggle from "./ToggleOnlineOffline";
import BeatLoader from "react-spinners/BeatLoader";

const ProfileCard = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([]);
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [isBackcoverModalOpen, setIsBackcoverModalOpen] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const handleAddCategory = () => {
    dispatch(setOpenDrawer(true));
  };

  const handleBackcoverClick = () => {
    setIsBackcoverModalOpen(true);
  };

  const handleLibraryImageSelect = async (image) => {
    try {
      setUploadingCover(true);
      console.log("Uploading cover image...");
      const token = localStorage.getItem("token");
      
      const formData = new FormData();
      formData.append("image_url", image.url);

      const response = await axiosClient.post(
        "/v1/vendor/me/images/upload?image_type=backcover",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Library image API response:", response.data);
      if (response.data?.url) {
        setVendorData((prev) => ({
          ...prev,
          backcover_url: `${response.data.url}?t=${new Date().getTime()}`,
        }));
        setCoverLoaded(true);
        // Close modal after successful upload
        setIsBackcoverModalOpen(false);
      }
    } catch (error) {
      console.error("Error setting library image:", error);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleUploadSelect = () => {
    // Trigger the file input for upload
    const fileInput = document.getElementById("coverUpload");
    if (fileInput) {
      fileInput.click();
    }
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
        setCoverLoaded(true);
        setProfileLoaded(true);
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
      setUploadingLogo(true);
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
        console.log("Inside if url...");
        console.log(response.data.url);
        setImage(`${response.data.url}?t=${new Date().getTime()}`);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleCoverChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadingCover(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosClient.post(
        "/v1/vendor/me/images/upload?image_type=backcover",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Cover API response");
      console.log(response.data);
      if (response.data?.url) {
        setVendorData((prev) => ({
          ...prev,
          backcover_url: `${response.data.url}?t=${new Date().getTime()}`,
        }));
        setCoverLoaded(true);
      }
    } catch (error) {
      console.error("Error uploading cover image:", error);
    } finally {
      setUploadingCover(false);
    }
  };

  return (
    <>
      <div className="flex flex-col    w-[100%] lg:w-[60%] md:w-[60%] border border-gray-100 rounded-md">
        <div className="w-full">
          {/* Cover Image */}
          {/* Cover Image with Upload */}
          <div className="relative w-full h-48">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="coverUpload"
              onChange={handleCoverChange}
            />

            <div
              onClick={handleBackcoverClick}
              className="group relative w-full h-full cursor-pointer block"
            >
              {!coverLoaded ? (
                <div className="w-full h-full bg-gray-200 animate-pulse rounded-t-md" />
              ) : (
                <img
                  src={vendorData?.backcover_url}
                  alt="Cover"
                  className="w-full h-full object-cover rounded-t-md transition-opacity duration-300 group-hover:opacity-50"
                  onLoad={() => setCoverLoaded(true)}
                />
              )}

              {uploadingCover ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-t-md">
                  <BeatLoader color="#ffffff" size={10} />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <PencilIcon className="w-6 h-6 text-[#7a48e3] bg-white p-1 rounded-full shadow" />
                </div>
              )}
            </div>
          </div>

          {/* Profile & Name Section */}
          <div className="relative bg-white px-4 pt-16 ">
            {/* Profile Image Container */}
            <div className="absolute -top-16 left-4 w-32 h-32">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="imageUpload"
                onChange={handleImageChange}
              />

              <label
                htmlFor="imageUpload"
                className="group relative w-full h-full rounded-full border-4 border-white shadow-md cursor-pointer overflow-hidden block"
              >
                {!profileLoaded ? (
                  <div className="w-full h-full rounded-full bg-gray-200 animate-pulse" />
                ) : (
                  <img
                    src={image}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full transition-opacity duration-300 group-hover:opacity-50"
                    onLoad={() => setProfileLoaded(true)}
                  />
                )}
                
                {uploadingLogo ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                    <BeatLoader color="#ffffff" size={8} />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PencilIcon className="w-6 h-6 text-[#7a48e3] bg-white p-1 rounded-full shadow" />
                  </div>
                )}
              </label>
            </div>
          </div>
          <div className="w-full flex justify-end">
            <OnlineOfflineToggle status={vendorData?.is_online} />
          </div>
        </div>

        <div className="p-5 ">
          <Tabs />

          {true && (
            <AddCategoryDrawer
              items={categories}
              setCategories={setCategories}
            />
          )}
        </div>
      </div>

      {/* Backcover Image Selection Modal */}
      <BackcoverImageModal
        isOpen={isBackcoverModalOpen}
        onClose={() => setIsBackcoverModalOpen(false)}
        onImageSelect={handleLibraryImageSelect}
        onUploadSelect={handleUploadSelect}
        uploading={uploadingCover}
      />
    </>
  );
};

export default ProfileCard;
