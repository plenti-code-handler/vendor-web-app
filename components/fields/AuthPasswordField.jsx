"use client";

import { passwordHideSvgAuth, passwordShowSvg } from "../../svgs";
import React, { useState } from "react";

const AuthPasswordField = ({ name, placeholder, register }) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative flex items-center">
      <input
        type={showPassword ? "text" : "password"}
        className="w-full placeholder:font-semibold rounded-md border border-gray-200 py-3 px-3 text-[13px] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        placeholder={placeholder || "Password"}
        {...register(name, { required: "Password is required" })}
        name={name}
      />
      <span
        className="absolute right-3 text-black font-semibold cursor-pointer"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? passwordShowSvg : passwordHideSvgAuth}
      </span>
    </div>
  );
};

export default AuthPasswordField;
