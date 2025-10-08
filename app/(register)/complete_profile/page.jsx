"use client";

import React, { useState, useEffect, useRef } from "react";
import HeaderStyle from "../../../components/sections/auth/HeaderStyle";
import { useRouter } from "next/navigation";
import BackButton from "../../../components/sections/auth/BackButton";
import { useForm } from "react-hook-form";
import axiosClient from "../../../AxiosClient";
import Link from "next/link";
import { useLoadScript } from "@react-google-maps/api";
import { toast } from "sonner";
import AuthLeftContent from "../../../components/layouts/AuthLeftContent";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const libraries = ["places"];

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
  const [mapUrl, setMapUrl] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState(""); // Add state for Google Maps URL
  
  const router = useRouter();
  const autoCompleteRef = useRef(null);
  const autocompleteInstanceRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: libraries,
  });

  // Debug Google Maps loading
  useEffect(() => {
    console.log("Google Maps API Status:", {
      isLoaded,
      loadError,
      apiKey: apiKey ? "Present" : "Missing",
      libraries
    });
    
    if (loadError) {
      console.error("Google Maps API Error:", loadError);
      toast.error("Failed to load Google Maps API");
    }
  }, [isLoaded, loadError, apiKey]);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    console.log("isLoaded", isLoaded);
    if (!isLoaded || !autoCompleteRef.current) return;

    try {
      // Clean up previous instance
      if (autocompleteInstanceRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteInstanceRef.current);
      }

      // Create new autocomplete instance
      autocompleteInstanceRef.current = new window.google.maps.places.Autocomplete(
        autoCompleteRef.current,
        { 
          types: ["geocode", "establishment"],
          componentRestrictions: { country: "IN" }, // Restrict to India
          fields: [
            "formatted_address", 
            "geometry", 
            "place_id", 
            "name",
            "url",                   
            "website",               
            "place_id",              
            "business_status",       
            "types"                  
          ]
        }
      );

      console.log("Autocomplete initialized:", autocompleteInstanceRef.current);

      // Add place_changed listener
      autocompleteInstanceRef.current.addListener("place_changed", () => {
        const place = autocompleteInstanceRef.current.getPlace();
        console.log("Selected place:", place);
        
        if (place.geometry && place.formatted_address) {
          const formattedAddress = place.formatted_address;
          const latitude = place.geometry.location.lat();
          const longitude = place.geometry.location.lng();
          
          setAddress(formattedAddress);
          setCoordinates({ lat: latitude, lng: longitude });
          setValue("addressUrl", formattedAddress);

          // Generate embed URL for iframe
          const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=15`;
          setMapUrl(embedUrl);

          // Generate Google Maps URL for address_url
          psUrl = place.url || `https://www.google.com/maps/place/${encodeURIComponent(formattedAddress)}/@${latitude},${longitude},15z`;
          setGoogleMapsUrl(googleMapsUrl);
          
          console.log("Google Maps URL:", googleMapsUrl);
          console.log("Embed URL:", embedUrl);
          
          toast.success("Address selected successfully!");
        } else {
          toast.error("Please select a valid address from the suggestions");
        }
      });

    } catch (error) {
      console.error("Error initializing autocomplete:", error);
      toast.error("Failed to initialize address autocomplete");
    }

    // Cleanup function
    return () => {
      if (autocompleteInstanceRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteInstanceRef.current);
        autocompleteInstanceRef.current = null;
      }
    };
  }, [isLoaded, setValue]);

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
        store_manager_name: data.storeManagerName || null,
        owner_name: data.ownerName, 
        vendor_type: data.vendorType,
        gst_number: data.gstnumber,
        description: data.description,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        address_url: googleMapsUrl, 
        address: address,
        pincode: data.pincode,
      };

      console.log("Vendor data being sent:", vendorData);

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
      router.push("/");
    } catch (error) {
      console.error("Error occurred during form submission:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/Background.png')" }}
    >
      <div className="flex flex-col lg:flex-row pt-5 pb-5 justify-between px-10">
        <AuthLeftContent />

        <div className="flex flex-col w-full lg:w-[40%] bg-white lg:h-[95vh] max-h-[800px] rounded-[24px] shadow-lg overflow-hidden mt-20">
          <div className="ml-5 mt-10">
            <BackButton />
          </div>
          <div className="flex flex-col justify-start items-center flex-1 px-6 pb-6 md:pb-10 lg:p-6 h-auto overflow-y-auto ">
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
                  Store Manager Name(Optional)
                </label>
                <input
                  type="text"
                  {...register("storeManagerName")}
                  className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter store Manager name"
                />
                {errors.storeManagerName && (
                  <p className="text-red-500 text-sm">
                    {errors.storeManagerName.message}
                  </p>
                )}
              </div>

              {/* Add Owner Name field */}
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-600">
                  Owner Name
                </label>
                <input
                  type="text"
                  {...register("ownerName")}
                  className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter owner name (optional)"
                />
                {errors.ownerName && (
                  <p className="text-red-500 text-sm">
                    {errors.ownerName.message}
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
                  type="text"
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
                <div className="relative">
                  <input
                    {...register("adressurl", {})}
                    type="text"
                    ref={autoCompleteRef}
                    className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black w-full"
                    placeholder={isLoaded ? "Search your business address" : "Loading address search..."}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={!isLoaded}
                  />
                  {!isLoaded && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    </div>
                  )}
                </div>
                {!isLoaded && (
                  <p className="text-xs text-gray-500 mt-1">Loading Google Places API...</p>
                )}
                {isLoaded && (
                  <p className="text-xs text-gray-500 mt-1">Start typing to see address suggestions</p>
                )}
                {errors.adressurl && (
                  <p className="text-red-500 text-sm">
                    {errors.adressurl.message}
                  </p>
                )}
              </div>

              {mapUrl && (
                <iframe
                  src={mapUrl}  
                  width="450"
                  height="250"
                  className="w-full rounded-lg"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              )}

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
    </div>
  );
}

export default Page;