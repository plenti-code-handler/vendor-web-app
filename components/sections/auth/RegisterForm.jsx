"use client";

import React, { useState } from "react";
import BackButton from "./BackButton";
import { useRouter } from "next/navigation";
// import { useDispatch } from "react-redux";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { whiteLoader } from "../../../svgs";

import {
  setOtpCode,
  setRegisterEmail,
  setRegisterPhone,
} from "../../../redux/slices/registerUserSlice";
import emailjs from "@emailjs/browser";
import { useForm } from "react-hook-form";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../app/firebase/config";
import { toast } from "sonner";

const RegisterForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const [generatedOtp, setGeneratedOtp] = useState(
    Array.from({ length: 6 }, () => Math.floor(Math.random() * 10).toString())
  );
  const [phone, setPhone] = useState("");

  // const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleContinue = async (data) => {
    const { email } = data;

    if (email && phone) {
      setLoading(true); // Start loading when form is submitted
      try {
        // Query the users collection to check if the email already exists
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Email already exists in the users collection
          toast.error("User Already Registered");
          setLoading(false); // Stop loading after failure
          return; // Exit the function to prevent further actions
        }

        // If email does not exist, proceed with OTP generation and email sending
        // dispatch(setRegisterEmail(email));
        // dispatch(setRegisterPhone(phone));
        // dispatch(setOtpCode(generatedOtp));

        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_KEY,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_KEY,
          {
            message: `Your OTP is ${generatedOtp
              .map((digit) => digit)
              .join("")}`,
            to_email: email,
            reply_to: "kontakt@foodiefinder.se",
          },
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
        );

        router.push("/verify");
      } catch (error) {
        console.error("Error checking email existence:", error);
        toast.error(
          "An error occurred while checking email. Please try again."
        );
      } finally {
        setLoading(false); // Stop loading after success or failure
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleContinue)}
      className="flex flex-col w-[390px] space-y-5"
    >
      <BackButton />
      <div className="flex flex-col space-y-3">
        <p className="text-black font-semibold text-[28px]">
          Register Your Business
        </p>
        <p className="text-[#A1A5B7] text-sm">
          Enter your email and phone number to register
        </p>
      </div>
      <input
        className="placeholder:font-bold rounded-md border border-gray-200 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        placeholder="Email"
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

      <PhoneInput
        defaultCountry="ua"
        value={phone}
        onChange={(phone) => setPhone(phone)}
        className="w-full custom-phone-input"
      />

      <button
        type="submit"
        disabled={loading} // Disable button while loading
        className={`flex justify-center bg-blueBgDark text-white font-semibold py-2  rounded hover:bg-blueBgDarkHover2 gap-2 lg:w-[100%] ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`} // Add opacity and disabled cursor style when loading
      >
        {loading && (
          <div className="animate-spin flex items-center justify-center">
            {whiteLoader}
          </div>
        )}
        {loading ? "Processing..." : "Continue"} {/* Show loading text */}
      </button>
    </form>
  );
};

export default RegisterForm;
