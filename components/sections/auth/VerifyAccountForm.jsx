"use client";

import React, { useState, useRef, useEffect } from "react";
import BackButton from "./BackButton";

const VerifyAccountForm = () => {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
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
      newOtp[index] = value.slice(-1); // only accept one digit
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
      setOtp(new Array(4).fill(""));
      setTimeLeft(60);
      setIsResendDisabled(true);
    }
  };

  return (
    <div className="flex flex-col w-[390px] space-y-5">
      <BackButton />
      <div className="flex flex-col space-y-3">
        <p className="text-black font-semibold text-[28px]">Verify Account</p>
        <p className="text-[#A1A5B7] text-[14px] font-medium">
          Code has been sent to{" "}
          <span className="font-bold text-blackTwo">johndoe@gmail.com.</span>
          <br />
          Enter the code to verify your account
        </p>
      </div>
      <div className="flex items-center justify-center gap-6">
        {otp.map((value, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            value={value}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            maxLength="1"
            className="rounded-[20px] border text-center text-bold border-[#DDDDDD] text-black text-[24px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black w-[64.43px] h-[64.43px]"
          />
        ))}
      </div>
      <div className="flex items-center justify-center">
        <p className="text-[#A1A5B7] text-[12px] font-medium">
          Didn't Receive Code?{" "}
          <span
            className={`underline ${
              isResendDisabled
                ? "text-gray-400"
                : "text-pinkBgDark cursor-pointer underline-offset-2 hover:text-pinkBgDarkHover2"
            }`}
            onClick={handleResend}
          >
            Resend Code
          </span>
          <br />
          <span className="block text-center mt-2">
            Resend Code in {`00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`}
          </span>
        </p>
      </div>
      <button className="flex justify-center bg-pinkBgDark text-white font-semibold py-2  rounded hover:bg-pinkBgDarkHover2 gap-2 lg:w-[100%]">
        Verify
      </button>
    </div>
  );
};

export default VerifyAccountForm;
