"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { rightArrowIcon } from "../../../svgs";
import { setOpenDrawer } from "../../../redux/slices/contactUserSlice";

const ContactSection = () => {
  const dispatch = useDispatch();

  const openContactForm = () => {
    dispatch(setOpenDrawer(true));
  };

  return (
    <div className="bg-homeSectionThree p-[5%] bg-center bg-cover w-auto flex flex-col justify-center">
      <div className="mx-auto flex flex-col gap-3">
        <h2 className="text-white text-[3em] font-[400]">Lorem Ipsum</h2>
        <p className="text-[1.25em] text-white font-[500]">
          Magnam sunt soluta amet. Tenetur impedit debitis dolor sapiente enim
          in soluta omnis earum. Voluptatem molestiae suscipit. Et quaerat rerum
          sit quo odio ullam ea.
        </p>
        <div className="flex items-center gap-5">
          <button
            onClick={openContactForm}
            className="mr-3 mt-2 lg:m-0 flex items-center min-w-[150px] px-[12px] py-[16px] text-center justify-center bg-secondary text-white font-semibold rounded-[6px] hover:bg-mainTwo"
          >
            <span className="mr-3 ml-2 font-semibold">Contact us</span>
            <span>{rightArrowIcon}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
