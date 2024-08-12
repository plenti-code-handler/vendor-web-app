"use client";
import React from "react";
import VerifyAccountForm from "../../../components/sections/auth/VerifyAccountForm";
import HeaderStyle from "../../../components/sections/auth/HeaderStyle";

const page = () => {
  return (
    <div className="flex flex-col w-full lg:w-[40%] bg-white lg:h-[95vh] max-h-[800px] rounded-[24px] justify-between shadow-lg overflow-hidden">
      <HeaderStyle />
      <div className="flex justify-center items-center flex-1 p-6">
        <VerifyAccountForm />
      </div>
    </div>
  );
};

export default page;
