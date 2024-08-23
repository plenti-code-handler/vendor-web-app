"use client";

import React, { useState, useRef, useEffect } from "react";
import BackButton from "./BackButton";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { setOtpCode } from "../../../redux/slices/registerUserSlice";
import emailjs from "@emailjs/browser";

const VerifyAccountForm = () => {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef([]);

  const dispatch = useDispatch();

  const email = useSelector((state) => state.registerUser.email);
  const generatedOtp = useSelector((state) => state.registerUser.otp);

  const router = useRouter();

  useEffect(() => {
    if (!email) router.push("/register");
  }, []);

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
      const otpCode = Array.from({ length: 4 }, () =>
        Math.floor(Math.random() * 10).toString()
      );
      dispatch(setOtpCode(otpCode));
      emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_KEY,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_KEY,
        {
          message: `Your OTP is ${otpCode.map((digit) => digit).join("")}`,
          to_email: email,
        },
        { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY }
      );
      setTimeLeft(60);
      setIsResendDisabled(true);
    }
  };

  const handleVerify = () => {
    const otpMatches = otp.every(
      (digit, index) => digit === generatedOtp[index]
    );

    if (otpMatches) {
      router.push("/setup_password");
    } else {
      console.log("OTP does not match. Please try again.");
    }
  };

  return (
    <div className="flex flex-col w-[390px] space-y-5">
      <BackButton />
      <div className="flex flex-col space-y-3">
        <p className="text-black font-semibold text-[28px]">Verify Account</p>
        <p className="text-[16px]">
          Code has been sent to{" "}
          <span className="font-bold text-blackTwo">{email}.</span>
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
            className="rounded-[20px] border text-center font-bold text-bold border-[#DDDDDD] text-black text-[24px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black w-[55px] h-[55px] md:w-[64.43px] md:h-[64.43px]"
          />
        ))}
      </div>
      <div className="flex items-center justify-center">
        <p className="text-[#494949] text-[12px] font-medium">
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
      <button
        onClick={handleVerify}
        className="flex justify-center bg-pinkBgDark text-white font-semibold py-2  rounded hover:bg-pinkBgDarkHover2 gap-2 lg:w-[100%]"
      >
        Verify
      </button>
    </div>
  );
};

export default VerifyAccountForm;
