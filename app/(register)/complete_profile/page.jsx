"use client";

import React, { useState, useEffect, useRef } from "react";
import HeaderStyle from "../../../components/sections/auth/HeaderStyle";
import { useRouter } from "next/navigation";
import BackButton from "../../../components/sections/auth/BackButton";
import { useForm } from "react-hook-form";
import axiosClient from "../../../AxiosClient";

// const GOOGLE_MAPS_API_KEY = "AIzaSyDOVLieRAacqoM0mB-49sRQnIfN3aCWC38";
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

function Page() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const mapRef = useRef(null);

  const router = useRouter();
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.onload = initializeAutocomplete;
        document.body.appendChild(script);
      } else {
        initializeAutocomplete();
      }
    };

    const initializeAutocomplete = () => {
      if (!autoCompleteRef.current) return;
      const autocomplete = new window.google.maps.places.Autocomplete(
        autoCompleteRef.current,
        { types: ["geocode"] }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const formattedAddress = place.formatted_address;
          const latitude = place.geometry.location.lat();
          const longitude = place.geometry.location.lng();
          setAddress(formattedAddress);
          setCoordinates({ lat: latitude, lng: longitude });
          setValue("addressUrl", formattedAddress);
        }
      });
    };

    loadGoogleMapsScript();
  }, [setValue]);

  useEffect(() => {
    if (coordinates.lat && coordinates.lng && window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: coordinates.lat, lng: coordinates.lng },
        zoom: 14,
      });
      new window.google.maps.Marker({
        position: { lat: coordinates.lat, lng: coordinates.lng },
        map: map,
      });
    }
  }, [coordinates]);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");

      setLoading(true);

      const formData = new FormData();
      formData.append("file", data.logo[0]);

      const uploadLogoResponse = await axiosClient.post(
        "/v1/vendor/me/images/upload?image_type=logo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload successful:", uploadLogoResponse.data);

      const vendorData = {
        vendor_name: data.storeName,
        store_manager_name: data.storeManagerName,
        vendor_type: data.vendorType,
        gst_number: data.gstnumber,
        description: data.description,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        address_url: address,
        pincode: data.pincode,
      };

      const uploadVendorDataResponse = await axiosClient.put(
        "/v1/vendor/me/update",
        vendorData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Vendor data uploaded successfully:",
        uploadVendorDataResponse.data
      );
      localStorage.removeItem("password");
      localStorage.removeItem("email");
      router.push("/login");
    } catch (error) {
      console.error("Error occurred during form submission:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between mt-10 min-h-screen px-6 lg:px-20">
      <div className="flex justify-center flex-col lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
        <a href="/">
          <img
            alt="Plenti Logo"
            src={"/Logo.png"}
            className="max-w-[180px] md:max-w-[240px] mx-auto lg:mx-0"
          />
        </a>
        <div className="flex flex-col gap-4 mt-4 lg:mt-6">
          <p className="text-[40px] font-bold text-gray-800">
            Stop waste, save food!
          </p>
          <p className="text-sm font-medium text-[#7E8299] leading-6">
            Choose from curated meal bags small, large, or surprise prepared by
            your favorite restaurants. Fast, easy, and always delicious.
            Download the app and grab your meal today!
          </p>
        </div>
      </div>

      <div className="flex flex-col w-full md:w-[80%] lg:w-[40%] bg-white rounded-[24px] justify-start shadow-lg h-auto">
        <HeaderStyle />
        <div className="ml-5 mt-10">
          <BackButton />
        </div>
        <div className="flex flex-col justify-start items-center flex-1 px-6 pb-6 md:pb-10 lg:p-6 h-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full max-w-md space-y-5"
          >
            <div className="flex flex-col space-y-3">
              <p className="text-black font-semibold text-[28px]">
                Complete Your Business Profile
              </p>
              <p className="text-[#A1A5B7] text-sm">
                Fill out the details below to complete your profile
              </p>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-600">Logo</label>
              <input
                type="file"
                {...register("logo", { required: "Logo is required" })}
                className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
              {errors.logo && (
                <p className="text-red-500 text-sm">{errors.logo.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Store Name
              </label>
              <input
                type="text"
                {...register("storeName", {
                  required: "Store name is required",
                })}
                className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter store name"
              />
              {errors.storeName && (
                <p className="text-red-500 text-sm">
                  {errors.storeName.message}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Store Manager Name
              </label>
              <input
                type="text"
                {...register("storeManagerName", {
                  required: "Store Manager name is required",
                })}
                className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter store Manager name"
              />
              {errors.storeManagerName && (
                <p className="text-red-500 text-sm">
                  {errors.storeManagerName.message}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Vendor Type
              </label>
              <select
                {...register("vendorType", {
                  required: "Vendor type is required",
                })}
                className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select Vendor Type</option>
                <option value="RESTAURANT">Restaurant</option>
                <option value="SUPERMARKET">Super Market</option>
                <option value="BAKERY">Bakery</option>
              </select>
              {errors.vendorType && (
                <p className="text-red-500 text-sm">
                  {errors.vendorType.message}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-600">
                GST Number
              </label>
              <input
                type="number"
                {...register("gstnumber", {
                  required: "GST Number is required",
                })}
                className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter Gst Number"
              />
              {errors.gstnumber && (
                <p className="text-red-500 text-sm">
                  {errors.gstnumber.message}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Pin Code
              </label>
              <input
                type="number"
                {...register("pincode", {
                  required: "Pin Code is required",
                })}
                className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter Pin Code"
              />
              {errors.pincode && (
                <p className="text-red-500 text-sm">{errors.pincode.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Description
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters",
                  },
                  maxLength: {
                    value: 250,
                    message: "Description cannot be more than 250 characters",
                  },
                })}
                rows={4}
                className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder="Enter your description (50 words max)"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Address
              </label>
              <input
                {...register("adressurl", {})}
                type="text"
                ref={autoCompleteRef}
                className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Search your business address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.adressurl && (
                <p className="text-red-500 text-sm">
                  {errors.adressurl.message}
                </p>
              )}
            </div>

            <div
              ref={mapRef}
              className="w-full h-64 rounded-md border mt-4"
            ></div>

            <div className="mt-6">
              <button
                type="submit"
                className={`flex justify-center bg-primary text-white font-semibold py-2 rounded hover:bg-hoverPrimary gap-2 w-full ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Processing..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;
