"use client";
import { useRouter } from "next/navigation";
import React from "react";

const AwaitingContent = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full max-w-[390px] h-auto space-y-5 items-center justify-center p-4">
      <div className="flex flex-col space-y-3 items-center justify-center text-center">
        <p className="text-black font-semibold text-2xl">Request Submitted</p>
        <img src="/tick-mark.png" className="w-[154px] h-[154px]"></img>
        <p className="text-blackTwo text-base font-medium">
          You’ve successfully submitted the
          <br />
          <span>request for a business account.</span>
          <br />
        </p>
        <p className="p-5 text-blackTwo">You’ll be notified via email</p>
      </div>
      <button
        onClick={() => router.replace("/login")}
        className="w-full bg-blueBgDark text-base text-white font-semibold py-2 rounded hover:bg-blueBgDarkHover2"
      >
        Okay Got It
      </button>
    </div>
  );
};

export default AwaitingContent;
