import React from "react";

export const Steps = () => {
  return (
    <div className="flex bg-[#191919] flex-row w-full gap-16  pl-[5%] pr-[5%] pt-[4%] pb-[4%]">
      <div className="w-1/2 ">
        <img className="rounded-lg" src="/Sqaures-image.png"></img>
      </div>
      <div className="w-1/2 flex flex-col justify-center gap-6">
        <h2 className={` text-main text-[2em] font-bold`}>
          Here's how FoodieFinder works - step by step:
        </h2>

        <h3 className={` text-white text-[1.3em] font-bold`}>
          Download and Register:
        </h3>

        <p className="text-white">
          Start by downloading the FoodieFinder app from the App Store or Google
          Play. Create an account by registering with your email address or via
          social media.
        </p>
      </div>
    </div>
  );
};
export default Steps; // Default export
