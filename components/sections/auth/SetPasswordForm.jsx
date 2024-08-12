import React from "react";
import AuthPasswordField from "../../fields/AuthPasswordField";

const SetPasswordForm = () => {
  return (
    <div className="flex flex-col w-[390px] space-y-7">
      <div className="flex flex-col space-y-3">
        <p className="text-black font-semibold text-[28px]">Set Password</p>
        <p className="text-[#A1A5B7] text-[14px] font-medium">
          For your account{" "}
          <span className="font-bold text-blackTwo">johndoe@gmail.com.</span>
        </p>
      </div>
      <AuthPasswordField />
      <AuthPasswordField placeholder={"Confirm Password"} />
      <button className="flex justify-center bg-pinkBgDark text-white font-semibold py-2  rounded hover:bg-pinkBgDarkHover2 gap-2 lg:w-[100%]">
        Continue
      </button>
    </div>
  );
};

export default SetPasswordForm;
