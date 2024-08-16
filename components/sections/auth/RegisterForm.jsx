import React from "react";
import BackButton from "./BackButton";

const RegisterForm = () => {
  return (
    <div className="flex flex-col w-[390px] space-y-5">
      <BackButton />
      <div className="flex flex-col space-y-3">
        <p className="text-black font-semibold text-[28px]">
          Register Your Business
        </p>
        <p className="text-[#A1A5B7] text-[14px]">
          Enter your email to register
        </p>
      </div>
      <input
        className="placeholder:font-bold rounded-md border border-gray-200 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        placeholder="Email"
      />
      <button className="flex justify-center bg-pinkBgDark text-white font-semibold py-2  rounded hover:bg-pinkBgDarkHover2 gap-2 lg:w-[100%]">
        Continue
      </button>
    </div>
  );
};

export default RegisterForm;
