"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { toast } from "sonner";
import {
  processPlaceForVendor,
  resolveOpeningHoursForPlace,
} from "../../../utility/googlePlacesUtils";
import {
  STORE_CLOSE_TIME_OPTIONS,
  STORE_OPEN_TIME_OPTIONS,
  timeSelectOptionsIncludingValue,
} from "../../../utility/openingHoursTimeOptions";
import PrimaryButton from "../../buttons/PrimaryButton";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const libraries = ["places"];

const CompleteProfileForm = ({ onSubmit, loading, initialData }) => {
  const [errors, setErrors] = useState({});
  const [mapUrl, setMapUrl] = useState("");

  // Store everything in one object (same pattern as Account.jsx)
  const [formData, setFormData] = useState({
    logoFile: null,
    storeManagerName: "",
    ownerName: "",
    vendorType: "",
    gstnumber: "",
    pannumber: "",
    fssainumber: "",
    openTime: "",
    closeTime: "",
    address: "",
    latitude: null,
    longitude: null,
    address_url: "",
    service_location: "",
  });

  const autoCompleteRef = useRef(null);
  const autocompleteInstanceRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: libraries,
  });

  // Initialize form and address state when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        storeManagerName: initialData.storeManagerName || "",
        ownerName: initialData.ownerName || "",
        vendorType: initialData.vendorType || "",
        gstnumber: initialData.gstnumber || "",
        pannumber: initialData.pannumber || "",
        fssainumber: initialData.fssainumber || "",
        openTime: initialData.openTime || "",
        closeTime: initialData.closeTime || "",
        address: initialData.address || "",
        latitude: initialData.latitude || null,
        longitude: initialData.longitude || null,
        address_url: initialData.address_url || "",
        service_location: initialData.service_location || "",
      }));

      if (initialData.latitude && initialData.longitude) {
        setMapUrl(
          `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${initialData.latitude},${initialData.longitude}&zoom=15`
        );
      } else {
        setMapUrl("");
      }
    }
  }, [initialData]);

  // Handle Google Maps API errors
  useEffect(() => {
    if (loadError) {
      console.error("Google Maps API Error:", loadError);
      toast.error("Failed to load Google Maps API. Please refresh the page.");
    }
  }, [loadError]);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!isLoaded || !autoCompleteRef.current || !apiKey) return;

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
          componentRestrictions: { country: "IN" },
          fields: [
            "formatted_address",
            "geometry",
            "place_id",
            "name",
            "url",
            "website",
            "business_status",
            "types",
            "address_components",
            "opening_hours",
            "utc_offset_minutes",
          ],
        }
      );

      // Add place_changed listener
      autocompleteInstanceRef.current.addListener("place_changed", () => {
        const place = autocompleteInstanceRef.current.getPlace();

        const run = async () => {
          const processedPlace = processPlaceForVendor(place, apiKey);
          if (!processedPlace) {
            toast.error("Please select a valid address from the suggestions");
            return;
          }

          let hours = null;
          try {
            hours = await resolveOpeningHoursForPlace(place);
          } catch {
            /* ignore */
          }

          setFormData((prev) => ({
            ...prev,
            address_url: processedPlace.googleMapsUrl,
            address: processedPlace.formattedAddress,
            latitude: processedPlace.latitude,
            longitude: processedPlace.longitude,
            service_location: processedPlace.serviceLocation,
            ...(hours?.openTime
              ? { openTime: hours.openTime }
              : {}),
            ...(hours?.closeTime
              ? { closeTime: hours.closeTime }
              : {}),
          }));
          setMapUrl(processedPlace.mapEmbedUrl);
          toast.success("Address selected successfully!");
        };

        void run();
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
  }, [isLoaded]);

  const handleWheel = (e) => {
    e.currentTarget.blur();
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const validate = useCallback(() => {
    const next = {};
    if (!formData.logoFile) next.logo = "Logo is required";
    if (!formData.ownerName?.trim()) next.ownerName = "Owner Name is required";
    if (!formData.vendorType) next.vendorType = "Vendor type is required";
    if (!formData.pannumber?.trim()) next.pannumber = "PAN Number is required";
    if (!formData.fssainumber?.trim()) next.fssainumber = "FSSAI Number is required";
    if (!formData.openTime?.trim()) next.openTime = "Opening time is required";
    if (!formData.closeTime?.trim()) next.closeTime = "Closing time is required";
    if (!formData.address || !formData.latitude || !formData.longitude) {
      next.adressurl = "Please select a valid address from the suggestions";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [formData]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Keep parent payload shape unchanged (`data.logo[0]` etc.)
    const rhfLikeData = {
      logo: [formData.logoFile],
      storeManagerName: formData.storeManagerName,
      ownerName: formData.ownerName,
      vendorType: formData.vendorType,
      gstnumber: formData.gstnumber,
      pannumber: formData.pannumber,
      fssainumber: formData.fssainumber,
    };

    await onSubmit(rhfLikeData, {
      address: formData.address,
      coordinates: { lat: formData.latitude, lng: formData.longitude },
      googleMapsUrl: formData.address_url,
      service_location: formData.service_location,
      opening_hours: {
        openTime: formData.openTime.trim(),
        closeTime: formData.closeTime.trim(),
      },
    });
  };

  return (
    <form
      onSubmit={handleFormSubmit}
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
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setFormData((prev) => ({ ...prev, logoFile: file }));
            if (errors.logo) setErrors((prev) => ({ ...prev, logo: undefined }));
          }}
          className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
        />
        {errors.logo && (
          <p className="text-red-500 text-sm">{errors.logo}</p>
        )}
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-600">
          Store Manager Name (Optional)
        </label>
        <input
          type="text"
          name="storeManagerName"
          value={formData.storeManagerName}
          onChange={handleChange}
          className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Enter store Manager name"
          onWheel={handleWheel}
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-600">
          Owner Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="ownerName"
          value={formData.ownerName}
          onChange={handleChange}
          className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Enter owner name"
          onWheel={handleWheel}
        />
        {errors.ownerName && (
          <p className="text-red-500 text-sm">
            {errors.ownerName}
          </p>
        )}
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-600">
          Vendor Type
        </label>
        <select
          name="vendorType"
          value={formData.vendorType}
          onChange={handleChange}
          className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">Select Vendor Type</option>
          <option value="RESTAURANT">Restaurant</option>
          <option value="SUPERMARKET">Super Market</option>
          <option value="BAKERY">Bakery</option>
        </select>
        {errors.vendorType && (
          <p className="text-red-500 text-sm">
            {errors.vendorType}
          </p>
        )}
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-600">
          GST Number (Optional)
        </label>
        <input
          type="text"
          name="gstnumber"
          value={formData.gstnumber}
          onChange={handleChange}
          className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Enter GST Number"
          onWheel={handleWheel}
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-600">
          PAN Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="pannumber"
          value={formData.pannumber}
          onChange={handleChange}
          className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Enter PAN Number"
          onWheel={handleWheel}
        />
        {errors.pannumber && (
          <p className="text-red-500 text-sm">
            {errors.pannumber}
          </p>
        )}
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-600">
          FSSAI Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="fssainumber"
          value={formData.fssainumber}
          onChange={handleChange}
          className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Enter FSSAI Number"
          onWheel={handleWheel}
        />
        {errors.fssainumber && (
          <p className="text-red-500 text-sm">
            {errors.fssainumber}
          </p>
        )}
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-600">
          Address
        </label>
        <div className="relative">
        <input
            type="text"
            ref={autoCompleteRef}
            className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black w-full"
            placeholder={isLoaded ? "Search your business as per Google" : "Loading address search..."}
            onWheel={handleWheel}
            value={formData.address}
            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
            disabled={!isLoaded}
            />
          {!isLoaded && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            </div>
          )}
        </div>
        {!isLoaded && (
          <p className="text-xs text-gray-500 mt-1">
            Loading Google Places API...
          </p>
        )}
        {isLoaded && (
          <p className="text-xs text-gray-500 mt-1">
            Start typing to see address suggestions
          </p>
        )}
        {errors.adressurl && (
          <p className="text-red-500 text-sm">
            {errors.adressurl}
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
          title="Business location map"
        />
      )}

<div className="flex flex-col space-y-1 sm:flex-row sm:gap-4">
        <div className="flex-1 flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-600">
            Opening time <span className="text-red-500">*</span>
          </label>
          <select
            name="openTime"
            value={formData.openTime}
            onChange={handleChange}
            className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Select open time</option>
            {timeSelectOptionsIncludingValue(
              formData.openTime,
              STORE_OPEN_TIME_OPTIONS
            ).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.openTime && (
            <p className="text-red-500 text-sm">{errors.openTime}</p>
          )}
        </div>
        <div className="flex-1 flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-600">
            Closing time <span className="text-red-500">*</span>
          </label>
          <select
            name="closeTime"
            value={formData.closeTime}
            onChange={handleChange}
            className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Select close time</option>
            {timeSelectOptionsIncludingValue(
              formData.closeTime,
              STORE_CLOSE_TIME_OPTIONS
            ).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.closeTime && (
            <p className="text-red-500 text-sm">{errors.closeTime}</p>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-500 -mt-2">
        Picked automatically from Google when available; adjust if needed (hourly slots).
      </p>


      <div className="mt-6">
      <PrimaryButton type="submit" className="w-full" loading={loading} loadingText="Processing...">
        Create Account
      </PrimaryButton>
      </div>
    </form>
  );
};

export default CompleteProfileForm;