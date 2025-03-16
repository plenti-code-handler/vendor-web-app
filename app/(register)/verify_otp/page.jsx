"use client";

import BackButton from "../../../components/sections/auth/BackButton";
import React, { useState, useRef, useEffect } from "react";
import HeaderStyle from "../../../components/sections/auth/HeaderStyle";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { baseUrl } from "../../../utility/BaseURL";
import axiosClient from "../../../AxiosClient";

const VerifyAccountForm = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef([]);

  const router = useRouter();

  // Handle countdown for resend button
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else {
      setIsResendDisabled(false); // Enable the resend button when time is up
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

  const handleVerify = async () => {
    if (otp.includes("")) {
      toast.error("Please enter all 6 OTP digits");
      return;
    }

    setLoading(true);
    const email = localStorage.getItem("email");
    if (!email) {
      alert("Email not found. Please try again.");
      setLoading(false);
      return;
    }

    const otpCode = otp.join("");

    try {
      const response = await axiosClient.post(
        `/v1/vendor/me/email/verify-otp?email=${email}&otp=${otpCode}`
      );

      console.log(response);

      if (response.status === 200) {
        toast.success("OTP Verified Successfully");
        const registerResponse = await axiosClient.post(
          `/v1/vendor/me/register?token=${response.data.access_token}`,
          {
            email: localStorage.getItem("email"),
            password: localStorage.getItem("password"),
          }
        );

        if (registerResponse.status === 200) {
          console.log(registerResponse.data.access_token);
          localStorage.setItem("token", registerResponse.data.access_token);
          router.push("/complete_profile");
        } else {
          toast.error("Registration failed. Please try again.");
        }
      } else {
        toast.error(response.data.message || "OTP verification failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const email = localStorage.getItem("email");
    if (!email) {
      alert("Email not found. Please try again.");
      return;
    }

    try {
      setLoading(true);
      const otpResponse = await axiosClient.post(
        `/v1/vendor/me/email/send-otp?email=${email}`
      );

      console.log("OTP response inside verify otp");
      console.log(otpResponse);

      if (otpResponse.status === 200) {
        toast.success("OTP sent successfully. Please verify.");

        setTimeLeft(60);
        setIsResendDisabled(true);
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
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
          </p>
        </div>
      </div>

      <div className="flex flex-col w-full md:w-[80%] lg:w-[40%] bg-white h-[90vh] max-h-[800px] rounded-[24px] shadow-lg overflow-hidden">
        <HeaderStyle />
        <div className="ml-10">
          <BackButton />
        </div>

        <div className="flex flex-col flex-grow items-center justify-center px-5">
          <p className="text-black font-semibold text-[28px]">Verify Account</p>
          <p className="text-base">Enter the code to verify your account</p>

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
                className="rounded-[10px] border text-center font-bold text-2xl w-[30px] h-[30px] md:w-[55px] md:h-[55px]"
              />
            ))}
          </div>
          <div className="flex items-center justify-center mt-5">
            <p className="text-[#494949] text-[12px] font-medium">
              Didn't Receive Code?{" "}
              <span
                className={`underline ${
                  isResendDisabled
                    ? "text-gray-400"
                    : "text-pinkBgDark cursor-pointer underline-offset-2 hover:text-pinkBgDarkHover2"
                }`}
                onClick={handleResend} // Enable resend logic
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

          <button
            onClick={handleVerify}
            className={`mt-5 bg-primary text-white font-semibold py-2 rounded w-[240px] md:w-[300px] ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Processing..." : "Verify"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccountForm;
