import React, { useEffect, useRef, useState } from "react";
import TextField from "../../../fields/TextField";
import { tickSvg } from "../../../../svgs";
import { Textarea } from "@headlessui/react";
import { useLoadScript } from "@react-google-maps/api";
import axiosClient from "../../../../AxiosClient";

import { removeDuplicateWords } from "../../../../utility/removeDuplicate";
import { toast } from "sonner";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const Account = () => {
  const [vendorData, setVendorData] = useState(null);
  const [originalData, setOriginalData] = useState(null); // Store original data for discard
  const [formData, setFormData] = useState({
    store_manager_name: "",
    vendor_type: "",
    gst_number: "",
    description: "",
    latitude: null,
    longitude: null,
    address_url: "",
    pincode: "",
    phone_number: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapUrl, setMapUrl] = useState("");

  const autoCompleteRef = useRef(null);

  // Fetch vendor data
  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosClient.get("/v1/vendor/me/get", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const vendor = response.data;
        console.log("Vendor details");
        console.log(vendor);
        setVendorData(vendor);
        setOriginalData(vendor);
        setFormData({
          store_manager_name: vendor.vendor_name || "",
          vendor_type: vendor.vendor_type || "",
          gst_number: vendor.gst_number || "",
          description: vendor.description || "",
          latitude: vendor.latitude || null,
          longitude: vendor.longitude || null,
          address_url: removeDuplicateWords(vendor.address_url) || "",
          pincode: vendor.pincode || "",
          phone_number: vendor.phone_number || "",
        });

        if (vendor.latitude && vendor.longitude) {
          setMapUrl(
            `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${vendor.latitude},${vendor.longitude}&zoom=14`
          );
        }
      } catch (err) {
        console.error("Error fetching vendor data:", err);
        setError(err.response?.data || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle address selection
  useEffect(() => {
    const initializeAutocomplete = () => {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        console.error("Google Maps API is not available.");
        return;
      }

      if (!autoCompleteRef.current) return;

      const autocomplete = new window.google.maps.places.Autocomplete(
        autoCompleteRef.current,
        { types: ["geocode"] }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          setFormData((prev) => ({
            ...prev,
            address_url: place.formatted_address,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
          }));

          setMapUrl(
            `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${place.geometry.location.lat()},${place.geometry.location.lng()}&zoom=14`
          );
        }
      });
    };

    initializeAutocomplete();
  }, []);

  // Discard changes
  const handleDiscardChanges = () => {
    setFormData({
      store_manager_name: originalData.vendor_name || "",
      vendor_type: originalData.vendor_type || "",
      gst_number: originalData.gst_number || "",
      description: originalData.description || "",
      latitude: originalData.latitude || null,
      longitude: originalData.longitude || null,
      address_url: removeDuplicateWords(originalData.address_url) || "",
      pincode: originalData.pincode || "",
      phone_number: originalData.phone_number || "",
    });
  };

  // Update API call
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.put("/v1/vendor/me/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profileupdate console");
      console.log(response);

      toast.success("Profile updated successfully!");
      setOriginalData(formData);
    } catch (err) {
      console.error("Error updating vendor data:", err);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="flex flex-col gap-4 pt-6 pb-6">
      <div>
        <h3 className="font-medium ml-1 mb-1">Store name</h3>
        <TextField
          placeholder="Store Name"
          name="store_manager_name"
          value={formData.store_manager_name}
          onChange={handleChange}
        />
      </div>
      <div>
        <h3 className="font-medium ml-1 mb-1">Email</h3>
        <div className="flex justify-between w-full rounded-lg border border-gray-300 bg-gray-100 py-3 px-3 text-sm text-black">
          <p className="font-semibold">
            {loading ? "Loading..." : vendorData?.email}
          </p>
          {vendorData?.email_verified && (
            <div className="flex gap-1 items-center">
              <p className="text-primary font-semibold">Verified</p>
              {tickSvg}
            </div>
          )}
        </div>
      </div>

      <div className="w-full">
        <h3 className="font-medium ml-1 mb-1">Store Type</h3>
        <select
          className="rounded-md w-full border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
          name="vendor_type"
          value={formData.vendor_type}
          onChange={handleChange}
        >
          <option value="RESTAURANT">Restaurant</option>
          <option value="SUPERMARKET">Super Market</option>
          <option value="BAKERY">Bakery</option>
        </select>
      </div>

      <div>
        <h3 className="font-medium ml-1 mb-1">GST Number</h3>
        <TextField
          placeholder="GST Number"
          name="gst_number"
          value={formData.gst_number}
          onChange={handleChange}
        />
      </div>
      <div>
        <h3 className="font-medium ml-1 mb-1">Phone Number</h3>
        <TextField
          placeholder="Phone Number"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
        />
      </div>

      <div className="w-full">
        <h3 className="font-medium ml-1 mb-1">Store Address</h3>
        <input
          type="text"
          ref={autoCompleteRef}
          className="rounded-md w-full border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Search your business address"
          name="address_url"
          value={formData.address_url}
          onChange={handleChange}
        />
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
      {/* 
      <Textarea
        className="block w-full resize-none rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        rows={8}
        placeholder="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
      /> */}

      <div className="flex gap-5 pt-2">
        <button
          className="flex justify-center bg-white text-black border border-black font-md py-2 rounded hover:bg-grayTwo gap-2 w-[100%]"
          onClick={handleDiscardChanges}
        >
          Discard Changes
        </button>
        <button
          className="flex justify-center bg-[#5F22D9] text-white font-md py-2 rounded hover:bg-[#7e45ee] gap-2 w-[100%]"
          onClick={handleUpdate}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default Account;
