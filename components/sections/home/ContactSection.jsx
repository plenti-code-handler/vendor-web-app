"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { rightArrowIcon } from "../../../svgs";
import { setOpenDrawer } from "../../../redux/slices/contactUserSlice";
import Link from "next/link";

const ContactSection = () => {
  const dispatch = useDispatch();

  const openContactForm = () => {
    dispatch(setOpenDrawer(true));
  };

  return (
    <div className="bg-homeSectionThreeMobile lg:bg-homeSectionThree p-[5%] rounded-[20px] mx-[2%] bg-center bg-cover w-auto flex flex-col justify-center">
      <div className="mx-auto flex flex-col gap-3 items-center">
        <h2 className="text-white text-[2.188em] font-extrabold text-center">
          Join the FoodieFinder Community!
        </h2>
        <p className="text-[1em] text-white text-center font-semibold md:w-[547px]">
          Become part of a vibrant community of food lovers and local
          restaurants. Share your favorite meal bag experiences, discover new
          culinary delights, and connect with fellow food enthusiasts.
        </p>
        <div className="flex items-center gap-5">
          <Link
            href={"/contact_us"}
            className="mr-3 mt-2 lg:m-0 flex items-center min-w-[150px] px-[16px] py-[14px] text-center justify-center bg-secondary text-white font-semibold rounded-[6px] hover:bg-mainTwo"
          >
            <span className="mr-3 ml-2 font-semibold">Contact us</span>
            <span>{rightArrowIcon}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
