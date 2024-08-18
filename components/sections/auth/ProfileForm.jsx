"use client";

import { Textarea } from "@headlessui/react";
import React, { useState } from "react";
import { pencilSvgProfile } from "../../../svgs";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  registerUser,
  setProfile,
} from "../../../redux/slices/registerUserSlice";
import { useRouter } from "next/navigation";

const ProfileForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [preview, setPreview] = useState("/person_placeholder.png"); // State for image preview
  const [profileImage, setProfileImage] = useState("/person_placeholder.png");
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const email = useSelector((state) => state.registerUser.email);
  const password = useSelector((state) => state.registerUser.password);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setProfileImage(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Create a preview URL
    }
  };

  const handleSubmit = async () => {
    try {
      dispatch(setProfile(profileImage, businessName, location, description));
      // Dispatch the registerUser action
      const userData = dispatch(
        registerUser({
          email,
          password,
          name: businessName,
          loc: location,
          desc: description,
          img: profileImage,
        })
      )
        .unwrap()
        .then((register) => {
          console.log(register);
        })
        .catch((err) => {
          console.error("Login failed:", err);
        });

      router.push("/awaiting");
    } catch (error) {
      // Handle errors (e.g., show an error message)
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="flex flex-col w-[390px] space-y-5">
      <div className="flex flex-col space-y-3">
        <p className="text-black font-semibold text-[28px]">
          Setup Business Profile
        </p>
        <p className="text-[#A1A5B7] text-[14px] font-medium">
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
        <p className="text-[#242424] text-[16px] font-medium mt-2">{email}</p>
      </div>

      <input
        className="placeholder:font-bold rounded-md border border-gray-200 py-3 px-3 text-black text-[13px] font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        placeholder="Business Name"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
      />
      <input
        className="placeholder:font-bold rounded-md border border-gray-200 py-3 px-3 text-black text-[13px] font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        placeholder="Address"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345094173!2d144.9537363159041!3d-37.81720974202165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce7e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1613989980106!5m2!1sen!2sus"
        className="w-full sm:w-[390px] sm:h-[123px] rounded-[8px]"
        style={{ border: 0 }}
        loading="lazy"
      />
      <Textarea
        className="block w-full placeholder:font-bold resize-none rounded-lg border border-gray-200 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        rows={6}
        placeholder="Description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="flex justify-center bg-pinkBgDark text-white font-semibold py-2 text-[16px] rounded hover:bg-pinkBgDarkHover2 gap-2 lg:w-[100%]"
      >
        Submit Request
      </button>
    </div>
  );
};

export default ProfileForm;
