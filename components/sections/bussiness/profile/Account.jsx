import React, { useEffect, useRef, useState } from "react";
import TextField from "../../../fields/TextField";
import { tickSvg } from "../../../../svgs";
import { Textarea } from "@headlessui/react";
import { useLoadScript } from "@react-google-maps/api";
import axiosClient from "../../../../AxiosClient";

const libraries = ["places"];
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const Account = () => {
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapUrl, setMapUrl] = useState("");

  const inputRef = useRef(null);

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
        if (response.data.latitude && response.data.longitude) {
          setMapUrl(
            `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${response.data.latitude},${response.data.longitude}&zoom=14`
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

  return (
    <div className="flex flex-col gap-4 pt-6 pb-6">
      {/* Name Field */}
      <TextField
        placeholder="Vendor Name"
        value={loading ? "Loading..." : vendorData?.vendor_name || ""}
        disabled={loading}
      />

      {/* Email */}
      <div className="flex justify-between w-full rounded-lg border border-gray-300 bg-gray-100 py-3 px-3 text-sm text-black">
        <p className="font-semibold">
          {loading ? "Loading..." : vendorData?.email}
        </p>
        {vendorData?.email_verified && (
          <div className="flex gap-1 items-center">
            <p className="text-green-600 font-semibold">Verified</p>
            {tickSvg}
          </div>
        )}
      </div>

      {/* GST Number */}
      <TextField
        placeholder="GST Number"
        value={loading ? "Loading..." : vendorData?.gst_number || ""}
        disabled={loading}
      />

      {/* Address Input */}
      <input
        ref={inputRef}
        className="block w-full rounded-lg border border-gray-300 py-3 px-3 text-sm text-black bg-gray-100"
        value={loading ? "Loading..." : vendorData?.address_url || ""}
        placeholder="Vendor Address"
        disabled={loading}
      />

      {/* Google Maps Embed */}
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

      {/* Description */}
      <Textarea
        className="block w-full resize-none rounded-lg border border-gray-300 py-3 px-3 text-sm text-black bg-gray-100"
        rows={5}
        placeholder="Description"
        value={loading ? "Loading..." : vendorData?.description || ""}
        disabled={loading}
      />
    </div>
  );
};

export default Account;
