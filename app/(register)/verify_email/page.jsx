"use client";

import React from "react";
import HeaderStyle from "../../../components/sections/auth/HeaderStyle";
import RegisterForm from "../../../components/sections/auth/RegisterForm";
import AuthLeftContent from "../../../components/layouts/AuthLeftContent";

import Link from "next/link";

function Page() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/Background.png')" }}
    >
      <div className="flex flex-col lg:flex-row pt-5 pb-5 justify-between px-10">
        <AuthLeftContent />

        <div className="flex flex-col w-full lg:w-[40%] bg-white lg:h-[95vh] max-h-[800px] rounded-[24px] items-center justify-center lg:justify-between shadow-lg overflow-hidden mt-20">
          <div className="flex justify-center w-full items-center flex-1 px-6 pb-16 md:pb-28 lg:p-6">
            <RegisterForm />
          </div>
        </div>
      </div>
  </div>
  );
}

export default Page;