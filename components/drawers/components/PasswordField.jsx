import { passwordHideSvg, passwordShowSvg } from "../../../svgs";
import React, { useState } from "react";

const PasswordField = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative flex items-center">
      <input
        type={showPassword ? "text" : "password"}
        className="block w-full placeholder:font-medium rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        placeholder="Type Password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span
        className="absolute right-3 text-black font-bold"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? passwordShowSvg : passwordHideSvg}
      </span>
    </div>
  );
};

export default PasswordField;
