import React from "react";
import ForgetPasswordForm from "../../../components/sections/auth/ForgetPasswordForm";
import HeaderStyle from "../../../components/sections/auth/HeaderStyle";

const page = () => {
  return (
    <div className="flex flex-col w-full lg:w-[40%] bg-white lg:h-[95vh] max-h-[800px] rounded-[24px] justify-between shadow-lg overflow-hidden">
      <HeaderStyle />
      <div className="flex justify-center items-center flex-1 p-6">
        <ForgetPasswordForm />
      </div>
      <div className="flex justify-center items-center p-6"></div>
    </div>
  );
};

export default page;
