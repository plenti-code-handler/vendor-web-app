"use client";

import React, { useState, useRef, useEffect } from "react";
import BackButton from "./BackButton";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setConfirmationResult } from "../../../redux/slices/registerUserSlice";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../../app/firebase/config";

const VerifyPhoneForm = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef([]);
  const recaptchaVerifierRef = useRef(null);

  const dispatch = useDispatch();
  const email = useSelector((state) => state.registerUser.email);
  const phone = useSelector((state) => state.registerUser.phone);
  const confirmationResult = useSelector(
    (state) => state.registerUser.confirmationResult
  );
  const router = useRouter();

  useEffect(() => {
    if (!email || !confirmationResult) router.push("/register");
  }, [email, confirmationResult]);

  useEffect(() => {
    recaptchaVerifierRef.current = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {}
    );
    return () => {
      recaptchaVerifierRef.current.clear();
    };
  }, []);

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
    signInWithPhoneNumber(auth, phone, recaptchaVerifierRef.current)
      .then((confirmationResult) => {
        dispatch(setConfirmationResult(confirmationResult));
        toast.success("OTP sent to your phone!");
      })
      .catch((error) => {
        toast.error("Error sending OTP: " + error.message);
        console.error("Error during phone number sign-in:", error);
      });
  };

  const handleVerify = () => {
    const otpCode = otp.join("");

    confirmationResult
      .confirm(otpCode)
      .then((result) => {
        // User signed in successfully
        toast.success("OTP verified successfully");
        router.push("/setup_password"); // Navigate to setup password
      })
      .catch((error) => {
        toast.error("Invalid OTP");
        console.error("OTP verification error:", error);
      });
  };

  return (
    <div className="flex flex-col w-[390px] space-y-5">
      <BackButton />
      <div className="flex flex-col space-y-3">
        <p className="text-black font-semibold text-[28px]">Verify Phone</p>
        <p className="text-[16px]">
          Code has been sent to{" "}
          <span className="font-bold text-blackTwo">{phone}</span>
          <br />
          Enter the code to verify your account
        </p>
      </div>
      <div className="flex items-center justify-center gap-3">
        {otp.map((value, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            value={value}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            maxLength="1"
            className="rounded-[15px] border text-center font-bold text-bold border-[#DDDDDD] text-black text-[24px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black w-[30px] h-[30px] md:w-[55px] md:h-[55px]"
          />
        ))}
      </div>
      <div id="recaptcha-container"></div>
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
        className="flex justify-center bg-pinkBgDark text-white font-semibold py-2 rounded hover:bg-pinkBgDarkHover2 gap-2 lg:w-[100%]"
      >
        Verify
      </button>
    </div>
  );
};

export default VerifyPhoneForm;
