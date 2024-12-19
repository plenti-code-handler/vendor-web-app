import React from "react";

const AuthLeftContent = () => {
  return (
    <div className="flex flex-col lg:w-[45%] items-center text-center mb-[5%] lg:mb-[0%]">
      <a href="/">
        <img
          alt="Plenti Logo"
          src={"/Logo.png"}
          className="max-w-[180px] md:max-w-[240px]"
        />
      </a>
      <div className="flex flex-col gap-4 mt-4 lg:mt-6">
        <p className="text-[40px] font-bold text-gray-800">
          {/* possimus ea <span className="text-secondary">laboriosam </span>
          laboriosam */}
          Stop waste, save food!
        </p>
        <p className="text-sm font-medium text-[#7E8299] leading-6 pl-[8%] pr-[8%]">
          Choose from curated meal bags small, large, or surprise prepared by
          your favorite restaurants. Fast, easy, and always delicious. Download
          the app and grab your meal today!
        </p>
      </div>
    </div>
  );
};

export default AuthLeftContent;
