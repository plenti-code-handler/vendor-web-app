"use client";

import BackButton from "../../../components/sections/auth/BackButton";
import React, { useState, useRef, useEffect } from "react";
import HeaderStyle from "../../../components/sections/auth/HeaderStyle";
import { useRouter } from "next/navigation";

const VerifyAccountForm = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loading, setloading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef([]);

  const router = useRouter();

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else {
      setIsResendDisabled(false);
    }
  }, [timeLeft]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResend = () => {
    if (!isResendDisabled) {
      setTimeLeft(60);
      setIsResendDisabled(true);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between h-screen px-6 items-center">
      <div className="flex flex-col lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
        <a href="/">
          <img
            alt="Plenti Logo"
            src={"/Logo.png"}
            className="max-w-[180px] md:max-w-[240px] mx-auto lg:mx-0 "
          />
        </a>
        <div className="flex flex-col gap-4 mt-4 lg:mt-6">
          <p className="text-[40px] font-bold text-gray-800">
            Stop waste, save food!
          </p>
          <p className="text-sm font-medium text-[#7E8299] leading-6">
            Choose from curated meal bags small, large, or surprise prepared by
            your favorite restaurants. Fast, easy, and always delicious.
            Download the app and grab your meal today!
          </p>
        </div>
      </div>

      <div className="flex flex-col w-full md:w-[80%] lg:w-[40%] bg-white h-[90vh] max-h-[800px] rounded-[24px] shadow-lg overflow-hidden">
        <HeaderStyle />
        <div className="ml-10">
          <BackButton />
        </div>

        <div className="flex flex-col flex-grow items-center justify-center px-5">
          <div className="flex flex-col space-y-3 text-center">
            <p className="text-black font-semibold text-[28px]">
              Verify Account
            </p>
            <p className="text-base">Enter the code to verify your account</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 xl:gap-3 mt-4 w-[240px] md:w-[300px]">
              {otp.map((value, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  maxLength="1"
                  className="rounded-[10px] xl:rounded-[15px] border text-center font-bold border-[#DDDDDD] text-black text-2xl focus:outline-none focus:ring-2 focus:ring-black w-[30px] h-[30px] md:w-[55px] md:h-[55px]"
                />
              ))}
            </div>

            <button
              onClick={() => router.push("/complete_profile")}
              className={`flex justify-center mt-5 bg-[#5F22D9] text-white font-semibold py-2 rounded hover:bg-[#8349f6] gap-2 w-[240px] md:w-[300px] ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Processing..." : "Continue"}
            </button>
          </div>

          <div className="flex items-center justify-center mt-3">
            <p className="text-[#494949] text-[12px] font-medium">
              Didn't Receive Code?{" "}
              <span
                className={`underline ${
                  isResendDisabled
                    ? "text-gray-400"
                    : "text-pinkBgDark cursor-pointer hover:text-pinkBgDarkHover2"
                }`}
                onClick={handleResend}
              >
                Resend Code
              </span>
              <br />
              <span className="block text-center mt-2">
                Resend Code in{" "}
                {`00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`}
              </span>
            </p>
          </div>
          <button className="flex justify-center bg-pinkBgDark text-white font-semibold py-2 rounded hover:bg-pinkBgDarkHover2 gap-2 w-full mt-4">
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccountForm;
