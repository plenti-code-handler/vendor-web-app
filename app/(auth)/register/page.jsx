import React from "react";
import RegisterForm from "../../../components/sections/auth/RegisterForm";
import HeaderStyle from "../../../components/sections/auth/HeaderStyle";

const page = () => {
  return (
    <div className="flex flex-col w-full md:w-[80%] lg:w-[40%] bg-white lg:h-[95vh] max-h-[800px] rounded-[24px] justify-between shadow-lg overflow-hidden">
      <HeaderStyle />
      <div className="flex justify-center items-center flex-1 px-6 pb-16  md:pb-28 lg:p-6">
        <RegisterForm />
      </div>
      <div className="flex justify-center items-center p-6">
        <div className="flex w-[390px] h-[50px] bg-[#FEC258]/20 items-center justify-center border border-[#FEC258] rounded-[8px]">
          <p className="text-sm text-black/60 items-center text-center">
            <span className="font-bold text-black">Note:</span> App will take
            15% of each bag purchased.
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
