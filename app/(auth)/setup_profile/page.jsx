import React from "react";
import ProfileForm from "../../../components/sections/auth/ProfileForm";

const page = () => {
  return (
    <div className="flex flex-col w-full md:w-[80%] lg:w-[600px] lg:max-w-[55%] bg-white rounded-[24px] justify-between shadow-lg overflow-hidden">
      <div className="flex justify-center flex-1 p-6 mt-[6%]">
        <ProfileForm />
      </div>
    </div>
  );
};

export default page;
