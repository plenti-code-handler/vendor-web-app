"use client";

import React, { useState } from "react";
import BackButton from "./BackButton";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../../../app/firebase/config";
import {
  setOtpCode,
  setRegisterEmail,
} from "../../../redux/slices/registerUserSlice";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { collection, getDocs, query, where } from "firebase/firestore";

const ForgetPasswordForm = () => {
  const router = useRouter();
  const [generatedOtp, setGeneratedOtp] = useState(
    Array.from({ length: 4 }, () => Math.floor(Math.random() * 10).toString())
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleContinue = async (data) => {
    const { email } = data;
    if (!email) return;

    try {
      // Check if the email exists in the users collection
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Email does not exist
        toast.error("No user found with this email address.");
        return;
      }

      // If email exists, proceed with sending the password reset email
      await sendPasswordResetEmail(auth, email, {
        url: `http://localhost:3000/reset_password?email=${email}`,
        handleCodeInApp: true,
      });

      toast.success("Password reset email sent! Check your Email");
    } catch (error) {
      console.error("Error processing password reset request:", error);
      toast.error(
        "An error occurred while sending the password reset email. Please try again."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleContinue)}
      className="flex flex-col w-[390px] space-y-5"
    >
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
        name="email"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email address",
          },
        })}
      />
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message}</p>
      )}
      <button
        type="submit"
        className="flex justify-center bg-pinkBgDark text-white font-semibold py-2  rounded hover:bg-pinkBgDarkHover2 gap-2 lg:w-[100%]"
      >
        Continue
      </button>
    </form>
  );
};

export default ForgetPasswordForm;
