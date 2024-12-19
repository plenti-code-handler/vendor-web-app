import React, { useEffect, useRef, useState } from "react";
import TextField from "../../../fields/TextField";
import { tickSvg } from "../../../../svgs";
import { Textarea } from "@headlessui/react";
import { getUserLocal } from "../../../../redux/slices/loggedInUserSlice";
import { useLoadScript } from "@react-google-maps/api";
import { db } from "../../../../app/firebase/config";
import { doc, GeoPoint, updateDoc } from "firebase/firestore";

const libraries = ["places"];

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // Replace with your actual API key

const Account = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [input, setInput] = useState({});
  const inputRef = useRef(null);
  const [location, setLocation] = useState("");
  const [user, setUser] = useState({});

  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  useEffect(() => {
    const user = getUserLocal();
    if (user) {
      setUser(user);
    }
  }, []);

  useEffect(() => {
    if (user.point) {
      setLat(user.point.latitude || null);
      setLng(user.point.longitude || null);
    }
  }, [user]);

  useEffect(() => {
    if (lat !== null && lng !== null) {
      setMapUrl(
        `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=${zoomLevel}`
      );
    }
  }, [lat, lng]);

  const zoomLevel = 14;

  const [mapUrl, setMapUrl] = useState(
    `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=${zoomLevel}`
  );

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const formData = (data) => {
    const addressComponents = data?.address_components;

    const componentMap = {
      subPremise: "",
      premise: "",
      street_number: "",
      route: "",
      country: "",
      postal_code: "",
      administrative_area_level_2: "",
      administrative_area_level_1: "",
    };

    for (const component of addressComponents) {
      const componentType = component.types[0];
      if (componentMap.hasOwnProperty(componentType)) {
        componentMap[componentType] = component.long_name;
      }
    }

    const formattedAddress =
      `${componentMap.subPremise} ${componentMap.premise} ${componentMap.street_number} ${componentMap.route}`.trim();
    const latitude = data?.geometry?.location?.lat();
    const longitude = data?.geometry?.location?.lng();

    setLat(latitude);
    setLng(longitude);
    setMapUrl(
      `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=${zoomLevel}`
    );

    setInput((values) => ({
      ...values,
      streetAddress: formattedAddress,
      country: componentMap.country,
      zipCode: componentMap.postal_code,
      city: componentMap.administrative_area_level_2,
      state: componentMap.administrative_area_level_1,
      latitude: latitude,
      longitude: longitude,
      completeAddress: `${formattedAddress}, ${componentMap.administrative_area_level_2}, ${componentMap.country}`,
    }));
  };

  const handlePlaceChanged = async (address) => {
    if (!isLoaded) return;
    const place = address.getPlace();
    setLocation(`${input.streetAddress}, ${input.city}, ${input.country}`);

    if (!place || !place.geometry) {
      // setInput({});
      return;
    }
    formData(place);
  };

  useEffect(() => {
    if (!isLoaded || loadError) return;

    const options = {
      fields: ["address_components", "geometry"],
    };

    const autocomplete = new google.maps.places.Autocomplete(
      inputRef.current,
      options
    );
    autocomplete.addListener("place_changed", () =>
      handlePlaceChanged(autocomplete)
    );

    // return () => autocomplete.removeListener("place_changed", handlePlaceChanged);
  }, [isLoaded, loadError]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInput((values) => ({ ...values, [name]: value }));
  };

  // Submit Handler
  const updateUser = async () => {
    try {
      if (name || description) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          name,
          loc: input.completeAddress,
          desc: description,
          point: new GeoPoint(input.latitude, input.longitude),
        });
      }
      console.log("User data updated successfully");
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const clearForm = () => {
    setName("");
    setInput("");
    setDescription("");
  };

  return (
    <div className="flex flex-col gap-4 pt-[30px] pb-[30px]">
      <TextField
        placeholder={user.name}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="flex justify-between w-full placeholder:font-bold rounded-lg border border-gray-300 bg-[#F4F4F4] py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black">
        <p className="font-semibold text-black">{user.email}</p>
        <div className="flex gap-1 items-center">
          <p className="text-main font-semibold">Verified</p>
          {tickSvg}
        </div>
      </div>
      <div className="flex justify-between w-full placeholder:font-bold rounded-lg border border-gray-300 bg-[#F4F4F4] py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black">
        <p className="font-semibold text-black">{user.phone}</p>
        <div className="flex gap-1 items-center">
          <p className="text-main font-semibold">Verified</p>
          {tickSvg}
        </div>
      </div>
      <input
        value={input.completeAddress || input.streetAddress || ""}
        className="block w-full placeholder:font-bold rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        onChange={handleChange}
        ref={inputRef}
        name="streetAddress"
        placeholder={user.loc}
      />
      {mapUrl && (
        <iframe
          src={mapUrl}
          width="450"
          height="250"
          className="w-full rounded-lg"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        />
      )}
      <Textarea
        className="block w-full resize-none rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        rows={8}
        placeholder={user.desc}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex gap-5 pt-2">
        <button
          onClick={clearForm}
          className="flex justify-center bg-white text-black border border-black font-md py-2  rounded hover:bg-grayTwo gap-2 w-[100%]"
        >
          Discard Changes
        </button>
        <button
          onClick={updateUser}
          className="flex justify-center bg-blueBgDark text-white font-md py-2  rounded hover:bg-blueBgDarkHover2 gap-2 w-[100%]"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default Account;
