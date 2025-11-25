"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useLoadScript } from "@react-google-maps/api";
import { toast } from "sonner";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const libraries = ["places"];

const CompleteProfileForm = ({ onSubmit, loading, initialData }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      storeManagerName: "",
      ownerName: "",
      vendorType: "",
      gstnumber: "",
      pincode: "",
      description: "",
    },
  });

  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [mapUrl, setMapUrl] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");

  const autoCompleteRef = useRef(null);
  const autocompleteInstanceRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: libraries,
  });

  // Initialize form and address state when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        storeManagerName: initialData.storeManagerName || "",
        ownerName: initialData.ownerName || "",
        vendorType: initialData.vendorType || "",
        gstnumber: initialData.gstnumber || "",
        pincode: initialData.pincode || "",
        description: initialData.description || "",
      });

      if (initialData.address) {
        setAddress(initialData.address);
      }
      if (initialData.latitude && initialData.longitude) {
        setCoordinates({
          lat: initialData.latitude,
          lng: initialData.longitude,
        });
        const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${initialData.latitude},${initialData.longitude}&zoom=15`;
        setMapUrl(embedUrl);
      }
      if (initialData.address_url) {
        setGoogleMapsUrl(initialData.address_url);
      }
    }
  }, [initialData, reset, apiKey]);

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
          ],
        }
      );

      // Add place_changed listener
      autocompleteInstanceRef.current.addListener("place_changed", () => {
        const place = autocompleteInstanceRef.current.getPlace();

        if (place.geometry && place.formatted_address) {
          const formattedAddress = place.formatted_address;
          const latitude = place.geometry.location.lat();
          const longitude = place.geometry.location.lng();

          setAddress(formattedAddress);
          setCoordinates({ lat: latitude, lng: longitude });

          // Generate embed URL for iframe
          const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=15`;
          setMapUrl(embedUrl);

          // Generate Google Maps URL for address_url
          const mapsUrl =
            place.url ||
            `https://www.google.com/maps/place/${encodeURIComponent(formattedAddress)}/@${latitude},${longitude},15z`;
          setGoogleMapsUrl(mapsUrl);

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
  }, [isLoaded, setValue, apiKey]);

  const handleFormSubmit = async (data) => {
    // Validate address and coordinates
    if (!address || !coordinates.lat || !coordinates.lng) {
      toast.error("Please select a valid address");
      return;
    }

    // Call parent's onSubmit with form data, address, coordinates, and googleMapsUrl
    await onSubmit(data, { address, coordinates, googleMapsUrl });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
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
          {...register("logo", { required: "Logo is required" })}
          className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
        />
        {errors.logo && (
          <p className="text-red-500 text-sm">{errors.logo.message}</p>
        )}
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-600">
          Store Manager Name (Optional)
        </label>
        <input
          type="text"
          {...register("storeManagerName")}
          className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Enter store Manager name"
        />
      </div>

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
          placeholder="Enter GST Number"
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
          placeholder="Enter your description (10-250 characters)"
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
          title="Business location map"
        />
      )}

      <div className="mt-6">
        <button
          type="submit"
          className={`flex justify-center bg-primary text-white font-semibold py-2 rounded hover:bg-hoverPrimary gap-2 w-full ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Create Account"}
        </button>
      </div>
    </form>
  );
};

export default CompleteProfileForm;