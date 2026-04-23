"use client";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import axiosClient from "../../../AxiosClient";
import SecondaryButton from "../../buttons/SecondaryButton";
import {
  EnvelopeIcon,
  LockClosedIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon, 
  ArrowUpRightIcon,
  ShoppingBagIcon
} from "@heroicons/react/24/outline";
import { useGoogleAuth } from "../../../hooks/useGoogleAuth";
import GoogleAuthButton from "../../buttons/GoogleAuthButton";

const LoginForm = ({ refreshState }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Use the Google auth hook
  const { loading: googleLoading, handleGoogleAuth, handleGoogleError } = useGoogleAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const identifier = watch("identifier");
  const password = watch("password");

  const handleLogin = async (data, event) => {
    event?.preventDefault();
    setLoading(true);

    const loginData = {
      identifier: data.identifier,
      password: data.password,
    };

    // Set prod flag based on password
    if (data.password === 'boutivis1234') {
      localStorage.setItem('prod', 'false');
    } else {
      localStorage.setItem('prod', 'true');
    }

    try {
      const response = await axiosClient.post("/v1/vendor/me/login", loginData);
      if (response.status === 200) {
        const { access_token, vendor } = response.data;
        console.log(vendor, "shine")
        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(vendor));

        // Trigger layout refresh
        if (refreshState) refreshState();

        // Smart redirect based on account status
        if (vendor?.is_active) {
          router.push("/business");
        } else {
          router.push("/onboard");
        }
      }
    } catch (error) {
      console.log(error);

      if (error.response?.status === 401) {
        toast.error("Invalid email/username or password");
      } else if (error.response?.status === 403) {
        toast.error("Account is deactivated. Please contact support.");
      } else if (error.response?.status === 422) {
        toast.error("Invalid credentials. Please check your email/username and password.");
      } else {
        toast.error("Login failed. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="flex flex-col w-full space-y-6 mt-10"
      >
        {/* Header Section */}
        <div className="space-y-3">
            <div className="space-y-2">
            <div className="flex items-center gap-3">
              <ShoppingBagIcon className="h-5 w-5 text-[#5F22D9]" />
              <h1 className="text-2xl font-semibold text-gray-900">
                Outlet Login
              </h1>
              <SecondaryButton
                onClick={() => router.push("/parent/login")}
                disabled={pathname?.startsWith?.("/parent")}
                className="px-[5px] py-[5px] text-xs hover:scale-100 flex items-center gap-1"
              >
                Admin login
                <ArrowRightIcon className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
              </SecondaryButton>
            </div>
            <p className="text-gray-600 text-sm">
              Sign in to your business account
            </p>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500">New to Plenti?</span>
            <Link
              href="/onboard"
              className="text-[#5F22D9] font-medium hover:text-[#4A1BB8] transition-colors duration-200 underline-offset-4 hover:underline"
            >
              Create account
            </Link>
          </div>
        </div>

        {/* Identifier Input */}
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Enter your email or username</p>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <EnvelopeIcon className={`h-5 w-5 transition-colors duration-200 ${focusedField === 'identifier' ? 'text-[#5F22D9]' : 'text-gray-400'
                }`} />
            </div>
            <input
              className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5F22D9]/20 focus:border-[#5F22D9] ${errors.identifier
                ? 'border-red-300 bg-red-50'
                : focusedField === 'identifier'
                  ? 'border-[#5F22D9] bg-white'
                  : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                }`}
              placeholder="Email or username"
              onFocus={() => setFocusedField('identifier')}
              onBlur={() => setFocusedField(null)}
              {...register("identifier", {
                required: "Email or username is required",
              })}
            />
            {identifier && !errors.identifier && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            )}
          </div>
          {errors.identifier && (
            <p className="text-red-500 text-xs flex items-center space-x-1">
              <span>⚠</span>
              <span>{errors.identifier.message}</span>
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon className={`h-5 w-5 transition-colors duration-200 ${focusedField === 'password' ? 'text-[#5F22D9]' : 'text-gray-400'
                }`} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              className={`w-full pl-10 pr-12 py-3 border rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5F22D9]/20 focus:border-[#5F22D9] ${errors.password
                ? 'border-red-300 bg-red-50'
                : focusedField === 'password'
                  ? 'border-[#5F22D9] bg-white'
                  : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                }`}
              placeholder="Enter your password"
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              {...register("password", {
                required: "Password is required",
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

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <Link
            href="/forgetPassword"
            className="text-sm text-[#5F22D9] hover:text-[#4A1BB8] transition-colors duration-200 underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || googleLoading}
          className={`group relative w-full flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5F22D9] ${loading || googleLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#5F22D9] hover:bg-[#4A1BB8] shadow-lg hover:shadow-xl'
            }`}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Signing in...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Sign in</span>
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          )}
        </button>

        {/* Add a divider with text "or" */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* Google Sign-In Button */}
        <GoogleAuthButton
          onSuccess={(response) => handleGoogleAuth(response, false)}
          onError={() => handleGoogleError(false)}
          text="continue_with"
        />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-gray-500">or if you need help</span>
          </div>
        </div>

        {/* Alternative Actions */}
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500">
            Need help?{" "}
            <Link
              href="/contactus"
              className="text-[#5F22D9] hover:text-[#4A1BB8] transition-colors duration-200 underline-offset-4 hover:underline"
            >
              Contact support
            </Link>
          </p>
        </div>
      </form>

      {/* Alert Toast */}
      {showAlert && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <span>⚠</span>
            <span className="text-sm font-medium">Invalid email or password</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { 
            transform: translateX(100%); 
            opacity: 0; 
          }
          to { 
            transform: translateX(0); 
            opacity: 1; 
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default LoginForm;