import React from "react";
import AwaitingContent from "../../../components/sections/auth/AwaitingContent";

const Page = () => {
  return (
    <div className="flex flex-col w-full lg:w-[40%] bg-white lg:h-[95vh] max-h-[800px] rounded-[24px] justify-between shadow-lg overflow-hidden">
      <div className="flex justify-center items-center flex-1 p-6">
        <AwaitingContent />
      </div>
    </div>
  );
};

export default Page;
