"use client";

import { Textarea } from "@headlessui/react";
import React, { useState } from "react";
import { pencilSvgProfile } from "../../../svgs";

const ProfileForm = () => {
  const [profileImage, setProfileImage] = useState("/person_placeholder.png");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
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
              src={profileImage}
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
        <p className="text-[#242424] text-[16px] font-medium mt-2">
          Haidermalik@comsats.edu.com
        </p>
      </div>

      <input
        className="placeholder:font-bold rounded-md border border-gray-200 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        placeholder="Business Name"
      />
      <input
        className="placeholder:font-bold rounded-md border border-gray-200 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        placeholder="Address"
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
      />
      <button className="flex justify-center bg-pinkBgDark text-white font-semibold py-2  rounded hover:bg-pinkBgDarkHover2 gap-2 lg:w-[100%]">
        Submit Request
      </button>
    </div>
  );
};

export default ProfileForm;
