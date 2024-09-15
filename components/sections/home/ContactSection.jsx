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
    <div className="bg-homeSectionThreeMobile lg:bg-homeSectionThree pt-[15%] pb-[15%] px-[5%] md:p-[5%] rounded-[20px] mx-[2%] bg-center bg-cover w-auto flex flex-col justify-center">
      <div className="mx-auto flex flex-col gap-3 items-center">
        <h2 className="text-white text-[2.188em] font-extrabold text-center">
          Join the FoodieFinder Community!
        </h2>
        <p className="text-[1em] text-white text-center   md:w-[80%]">
          FoodieFinder is a committed platform that works to reduce food waste
          and make sustainable choices easier, in line with the global goals. We
          particularly focus on Goal 12, "Sustainable consumption and
          production", where we contribute to the sub-goal of halving global
          food waste per person at the retail and consumer level. By inspiring
          and engaging our community, we strive to create positive change for
          people and the planet.
        </p>
        <div className="flex items-center gap-5">
          <Link
            href={"/contact_us"}
            className="mr-3 mt-2 lg:m-0 flex items-center min-w-[150px] px-[10px] py-[10px] text-center justify-center bg-mainLight text-white font-semibold rounded-[6px] hover:bg-pinkTextOne transition-colors duration-500"
          >
            <span className="mr-3 ml-2 font-semibold uppercase">
              Contact us
            </span>
            <span>{rightArrowIcon}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
