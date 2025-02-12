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
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapUrl, setMapUrl] = useState("");

  const inputRef = useRef(null);
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axiosClient.get("/v1/vendor/me/get", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data);

        setVendorData(response.data);
        setDescription(response.data.description);
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

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (typeof window.google === "undefined" || !window.google.maps) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          console.log("Google Maps API loaded successfully.");
          initializeAutocomplete();
        };

        script.onerror = () => {
          console.error("Google Maps API failed to load.");
        };

        document.body.appendChild(script);
      } else {
        initializeAutocomplete();
      }
    };

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
          const formattedAddress = place.formatted_address;
          const latitude = place.geometry.location.lat();
          const longitude = place.geometry.location.lng();
          setAddress(formattedAddress);
          setCoordinates({ lat: latitude, lng: longitude });
          setMapUrl(
            `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=14`
          );
        }
      });
    };

    loadGoogleMapsScript();
  }, []);

  return (
    <div className="flex flex-col gap-4 pt-6 pb-6">
      <TextField
        placeholder="Vendor Name"
        value={loading ? "Loading..." : vendorData?.vendor_name || ""}
        disabled={loading}
      />

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

      <TextField
        placeholder="GST Number"
        value={loading ? "Loading..." : vendorData?.gst_number || ""}
        disabled={loading}
      />

      <input
        type="text"
        ref={autoCompleteRef}
        className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
        placeholder="Search your business address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

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

      <Textarea
        className="block w-full resize-none rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        rows={8}
        placeholder={"Description"}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex gap-5 pt-2">
        <button className="flex justify-center bg-white text-black border border-black font-md py-2  rounded hover:bg-grayTwo gap-2 w-[100%]">
          Discard Changes
        </button>
        <button className="flex justify-center bg-[#5F22D9] text-white font-md py-2  rounded hover:bg-[#7e45ee] gap-2 w-[100%]">
          Update
        </button>
      </div>
    </div>
  );
};

export default Account;
