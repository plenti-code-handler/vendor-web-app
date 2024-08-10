"use client";
import React from "react";
import LoginForm from "../../components/sections/auth/LoginForm";
import HeaderStyle from "../../components/sections/auth/HeaderStyle";

const page = () => {
  return (
    <div className="flex flex-col w-full lg:w-[40%] bg-white h-[95vh] max-h-[800px] rounded-[24px] justify-between shadow-lg overflow-hidden">
      <HeaderStyle />
      <div className="flex justify-center items-center flex-1 p-6">
        <LoginForm />
      </div>
    </div>
  );
};

export default page;
