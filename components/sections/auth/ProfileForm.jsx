"use client";

import { Textarea } from "@headlessui/react";
import React, { useEffect, useRef, useState } from "react";
import { pencilSvgProfile } from "../../../svgs";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  registerUser,
  setProfile,
} from "../../../redux/slices/registerUserSlice";
import { useRouter } from "next/navigation";
import { useLoadScript } from "@react-google-maps/api";
import { GeoPoint } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const libraries = ["places"];

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // Replace with your actual API key

const ProfileForm = () => {
  const placeholderImage =
    "https://firebasestorage.googleapis.com/v0/b/foodie-finder-ee1d8.appspot.com/o/person.png?alt=media&token=3d046313-6334-44cd-abf5-1345111c9cee";

  const dispatch = useDispatch();
  const router = useRouter();
  const [preview, setPreview] = useState(placeholderImage); // State for image preview
  const [profileImage, setProfileImage] = useState(placeholderImage);
  // const [businessName, setBusinessName] = useState("");
  // const [description, setDescription] = useState("");

  const email = useSelector((state) => state.registerUser.email);
  const password = useSelector((state) => state.registerUser.password);
  const phone = useSelector((state) => state.registerUser.phone);

  useEffect(() => {
    if (!email && !password) router.push("/register");
  }, []);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setProfileImage(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Create a preview URL
    }
  };

  const handleProfileSubmit = async (data) => {
    try {
      const { businessName, description } = data;
      dispatch(setProfile(profileImage, businessName, location, description));
      // Dispatch the registerUser action
      const userData = dispatch(
        registerUser({
          email,
          password,
          name: businessName,
          loc: input.completeAddress,
          desc: description,
          img: profileImage,
          point: new GeoPoint(input.latitude, input.longitude),
          phone,
        })
      )
        .unwrap()
        .then((register) => {
          console.log(register);
          toast.success("Your request has been sent");
        })
        .catch((err) => {
          console.error("Register failed:", err);
          toast.error("Something went wrong. Please try again");
        });

      router.push("/awaiting");
    } catch (error) {
      // Handle errors (e.g., show an error message)
      console.error("Registration failed:", error);
    }
  };

  const [input, setInput] = useState({});
  const inputRef = useRef(null);
  const [location, setLocation] = useState("");

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

  return (
    <form
      onSubmit={handleSubmit(handleProfileSubmit)}
      className="flex flex-col w-[390px] space-y-5"
    >
      <div className="flex flex-col space-y-3">
        <p className="text-black font-semibold text-[28px]">
          Setup Business Profile
        </p>
        <p className="text-[#A1A5B7] text-sm font-medium">
          You can update it later on
        </p>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="relative w-[90.95px] h-[90.95px]">
          <div className="bg-[#C2C2C2]/20 rounded-full items-center justify-center flex overflow-hidden w-full h-full">
            <img
              src={preview}
              alt="Profile"
              className="object-cover rounded-full"
            />
          </div>
          <label
            htmlFor="upload-button"
            className="absolute bottom-0 right-0 transform translate-x-1/5 translate-y-1/5 bg-secondary w-[24px] h-[24px] items-center justify-center flex rounded-full cursor-pointer"
          >
            <input
              id="upload-button"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <span className="text-white">{pencilSvgProfile}</span>
          </label>
        </div>
        <p className="text-[#242424] text-base font-medium mt-2">{email}</p>
      </div>

      <input
        className="placeholder:font-bold rounded-md border border-gray-200 py-3 px-3 text-black text-[13px] font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        placeholder="Business Name"
        name="businessName"
        {...register("businessName", {
          required: "Business name is required",
        })}
      />
      {errors.businessName && (
        <p className="text-red-500 text-sm">{errors.businessName.message}</p>
      )}
      <input
        value={input.completeAddress || input.streetAddress || ""}
        className="block w-full placeholder:font-bold rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        onChange={handleChange}
        ref={inputRef}
        name="streetAddress"
        placeholder="Enter Location"
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
        className="block w-full placeholder:font-bold resize-none rounded-lg border border-gray-200 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        rows={6}
        name="description"
        placeholder="Description..."
        {...register("description", {
          required: "Description is required",
        })}
      />
      {errors.description && (
        <p className="text-red-500 text-sm">{errors.description.message}</p>
      )}
      <button
        onClick={handleSubmit}
        className="flex justify-center bg-blueBgDark text-white font-semibold py-2 text-base rounded hover:bg-blueBgDarkHover2 gap-2 lg:w-[100%]"
      >
        Submit Request
      </button>
    </form>
  );
};

export default ProfileForm;
