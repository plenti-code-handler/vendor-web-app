import React from "react";
import AwaitingContent from "../../../components/sections/auth/AwaitingContent";

const Page = () => {
  return (
    <div className="flex flex-col w-full md:w-[80%] lg:w-[40%] bg-white lg:h-[95vh] max-h-[800px] rounded-[24px] justify-between shadow-lg overflow-hidden">
      <div className="flex justify-center items-center flex-1 px-6 pb-16  md:pb-28 lg:p-6">
        <AwaitingContent />
      </div>
    </div>
  );
};

export default Page;
