import Link from "next/link";
import React from "react";

const AuthLeftContent = () => {
  return (
    <div className="flex  lg:w-[45%] items-center text-center mb-[5%] lg:mb-[0%] justify-center w-full lg:h-screen">
      <div className="flex ">
        <Link href="/">
          <img
            alt="Plenti Logo"
            src={"/splash-logo.png"}
            className="max-w-[180px] md:max-w-[240px] cursor-pointer"
          />
        </Link>
        <div className="bg-white w-1 h-20 mt-2"></div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl text-white text-start ml-5 mt-2">
            India'a first
          </h2>
          <h3 className="text-2xl text-white text-start ml-5">
            surplus Food Marketspace
          </h3>
        </div>
      </div>
    </div>
  );
};

export default AuthLeftContent;
