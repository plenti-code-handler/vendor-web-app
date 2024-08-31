"use client";

import React, { useState } from "react";
import BackButton from "./BackButton";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../app/firebase/config";
import {
  setOtpCode,
  setRegisterEmail,
} from "../../../redux/slices/registerUserSlice";
import emailjs from "@emailjs/browser";

const ForgetPasswordForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(
    Array.from({ length: 4 }, () => Math.floor(Math.random() * 10).toString())
  );

  const dispatch = useDispatch();

  const handleContinue = async () => {
    // if (email) {
    //   dispatch(setRegisterEmail(email));
    //   dispatch(setOtpCode(generatedOtp));
    //   emailjs.send(
    //     process.env.NEXT_PUBLIC_EMAILJS_SERVICE_KEY,
    //     process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_KEY,
    //     {
    //       message: `Your OTP is ${generatedOtp.map((digit) => digit).join("")}`,
    //       to_email: email,
    //     },
    //     { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY }
    //   );
    //   router.push("/reset_password");
    // }
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent!");
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }
  };

  return (
    <div className="flex flex-col w-[390px] space-y-5">
      <BackButton />
      <div className="flex flex-col space-y-3">
        <p className="text-black font-semibold text-[28px]">Forget Password</p>
        <p className="text-[#A1A5B7] text-[14px]">
          Enter your email associated with your account.
        </p>
        <p className="text-[#A1A5B7] text-[14px]">
          A code will be sent to your account for verification.
        </p>
      </div>
      <input
        className="placeholder:font-bold rounded-md border border-gray-200 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleContinue}
        className="flex justify-center bg-pinkBgDark text-white font-semibold py-2  rounded hover:bg-pinkBgDarkHover2 gap-2 lg:w-[100%]"
      >
        Continue
      </button>
    </div>
  );
};

export default ForgetPasswordForm;
