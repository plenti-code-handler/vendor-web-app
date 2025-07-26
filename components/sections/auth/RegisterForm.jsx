"use client";
import Link from "next/link";
import AuthPasswordField from "../../fields/AuthPasswordField";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { whiteLoader } from "../../../svgs";
import axiosClient from "../../../AxiosClient";
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon,
  BuildingStorefrontIcon
} from "@heroicons/react/24/outline";

const RegisterForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const email = watch("email");
  const password = watch("password");

  const handleRegister = async (data, event) => {
    console.log("Inside handle register");
    event?.preventDefault();
    setLoading(true);

    const registerData = {
      email: data.email,
      password: data.password,
    };

    try {
      // Step 1: Send OTP to email
      const response = await axiosClient.post(
        `/v1/vendor/me/email/send-otp?email=${data.email}`
      );

      console.log(response);
      if (response.status === 200) {
        console.log("OTP sent successfully");
        
        // Step 2: Store email and password for later use
        localStorage.setItem("email", data.email);
        localStorage.setItem("password", data.password);
        
        // Step 3: Show success toast
        toast.success("OTP sent successfully! Please check your email and verify.");
        
        // Step 4: Redirect to OTP verification page
        router.push("/verify_otp");
      }
    } catch (error) {
      console.log(error);
      
      // Better error handling
      if (error.response?.status === 400) {
        toast.error("Email already registered. Please login instead.");
      } else if (error.response?.status === 422) {
        toast.error("Invalid email format. Please check your email.");
      } else if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleRegister)}
        className="flex flex-col w-full space-y-6 mt-10"
      >
        {/* Header Section */}
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#5F22D9]/10 rounded-lg flex items-center justify-center">
                <BuildingStorefrontIcon className="w-5 h-5 text-[#5F22D9]" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Join Plenti
              </h1>
            </div>
            <p className="text-gray-600 text-sm">
              Create your business account to start selling
            </p>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500">Already have an account?</span>
            <Link 
              href="/login"
              className="text-[#5F22D9] font-medium hover:text-[#4A1BB8] transition-colors duration-200 underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <EnvelopeIcon className={`h-5 w-5 transition-colors duration-200 ${
                focusedField === 'email' ? 'text-[#5F22D9]' : 'text-gray-400'
              }`} />
            </div>
            <input
              className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5F22D9]/20 focus:border-[#5F22D9] ${
                errors.email 
                  ? 'border-red-300 bg-red-50' 
                  : focusedField === 'email'
                  ? 'border-[#5F22D9] bg-white'
                  : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
              }`}
              placeholder="Enter your business email"
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {email && !errors.email && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            )}
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs flex items-center space-x-1">
              <span>⚠</span>
              <span>{errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon className={`h-5 w-5 transition-colors duration-200 ${
                focusedField === 'password' ? 'text-[#5F22D9]' : 'text-gray-400'
              }`} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              className={`w-full pl-10 pr-12 py-3 border rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5F22D9]/20 focus:border-[#5F22D9] ${
                errors.password 
                  ? 'border-red-300 bg-red-50' 
                  : focusedField === 'password'
                  ? 'border-[#5F22D9] bg-white'
                  : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
              }`}
              placeholder="Create a strong password"
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs flex items-center space-x-1">
              <span>⚠</span>
              <span>{errors.password.message}</span>
            </p>
          )}
        </div>

        {/* Password Requirements */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <p className="text-xs font-medium text-gray-700">Password requirements:</p>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 rounded-full ${
                password && password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <span className="text-xs text-gray-600">At least 8 characters</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 rounded-full ${
                password && /[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <span className="text-xs text-gray-600">One uppercase letter</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 rounded-full ${
                password && /[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <span className="text-xs text-gray-600">One number</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`group relative w-full flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5F22D9] ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[#5F22D9] hover:bg-[#4A1BB8] shadow-lg hover:shadow-xl'
          }`}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Sending OTP...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Continue</span>
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          )}
        </button>

        {/* Terms and Privacy */}
        <div className="text-center space-y-3">
          <p className="text-xs text-gray-500 leading-relaxed">
            By continuing, you agree to our{" "}
            <Link 
              href="/terms" 
              className="text-[#5F22D9] hover:text-[#4A1BB8] transition-colors duration-200 underline-offset-4 hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link 
              href="/privacy" 
              className="text-[#5F22D9] hover:text-[#4A1BB8] transition-colors duration-200 underline-offset-4 hover:underline"
            >
              Privacy Policy
            </Link>
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <span>Secure registration process</span>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-gray-500">Need help?</span>
          </div>
        </div>

        {/* Support Link */}
        <div className="text-center">
          <Link 
            href="/contact" 
            className="text-sm text-[#5F22D9] hover:text-[#4A1BB8] transition-colors duration-200 underline-offset-4 hover:underline"
          >
            Contact our support team
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;